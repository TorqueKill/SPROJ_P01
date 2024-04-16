<script>
// @ts-nocheck

  import { onMount } from 'svelte';
  import { gameHistory, gameHistHost, gameHistPlayer } from "$lib/dummyGames";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";

  // dummy email
  let playerEmail = "example@example.com"; 

  // let playerEmail = $user.email;


  let detailedPlayerHistory = [];
  const hostHistory = writable([]);

  let showPlayerHistory = false;
  let showHostHistory = false;

  let fadePlayedButton = false;
  let fadeHostedButton = false;

  let localPlayerHistory;
  let localHostHistory;

  onMount(() => {
  // if ($user.email == null || $user.email == "") {
  //   alert("Must be logged in to view history");
  //   goto("/");
  // }

  //localPlayerHistory = JSON.parse(localStorage.getItem("playerGameHistory"));
  if (localPlayerHistory == null) {
    localPlayerHistory = [];
  }

  if (localPlayerHistory.length == 0) {
      localPlayerHistory = gameHistPlayer;
    }

  //localHostHistory = JSON.parse(localStorage.getItem("hostGameHistory"));
  if (localHostHistory == null) {
    localHostHistory = [];
  }

  if (localHostHistory.length == 0) {
      localHostHistory = gameHistHost;
    }

  console.log("localPlayerHistory:", localPlayerHistory);
  console.log("localHostHistory:", localHostHistory);

  });

  function togglePlayerHistory(email) {
    playerEmail = email; 
    showHostHistory = false; 
    showPlayerHistory = true; 
    fadePlayedButton = true;

    detailedPlayerHistory = getDetailedPlayerHistory(email);

  }

  // Function to retrieve detailed player history based on email
  function getDetailedPlayerHistory(email) {
    const player = localPlayerHistory.find(player => player.email === email); 
    if (player) {

      return player.gameHistory.map(game => ({
        quiz: game.quiz.title,
        quizScore: game.score.find(score => score.name === email).scores.reduce((acc, cur) => acc + cur, 0),
        details: game.quiz.quiz.map((question, index) => ({
          question: question.question,
          providedAnswer: game.score.find(score => score.name === email).scores[index] ? game.quiz.quiz[index].choices[game.score.find(score => score.name === email).scores[index]] : 'No answer provided',
          correctAnswer: game.quiz.quiz[index].answer,
          wasCorrect: game.score.find(score => score.name === email).scores[index] === 1
        }))
      }));
    } else {
      alert("No history to show");
      showPlayerHistory = !showPlayerHistory;
      return [];
    }
  }

  function toggleHostHistory(email) {
  playerEmail = email; 
  showPlayerHistory = false; 
  showHostHistory = true; 
  fadeHostedButton = true;

  hostHistory.set(getHostHistory(email)); 
  }

  // Function to retrieve detailed host history based on email

  function getHostHistory(email) {
  const host = localHostHistory.find(host => host.email === email); 
  if (host) {
    return host.gameHistory.map(game => ({
      quiz: game.quiz.title,
      players: game.score.map(player => ({
        name: player.name,
        score: player.scores.reduce((acc, cur) => acc + cur, 0)
      }))
    }));
  } else {
    alert("No history to show");
    showHostHistory = !showHostHistory;
    return [];
  }
  }

  function deleteHistory() {
    detailedPlayerHistory = [];
    hostHistory.set([]);
    showPlayerHistory = false;
    showHostHistory = false;
    fadePlayedButton = false;
    fadeHostedButton = false;
  }

  function logout() {
    try {
      //await authService.logout();

      goto('/signIn');
    } catch (error) {
    console.error('Logout failed:', error);
  }
  }

</script>
  
<main>
  <body class="bg-purple-500">
    <div class="bg-purple-900 text-white py-4">
      <div class="navbar mx-auto px-4 flex justify-between items-center">

        <div>
          <a href="/hostOrPlayer" class="hover:text-white">Back</a>
        </div>

        <div class="ml-12 font-bold text-2xl flex items-center">
          <span>Quiz History</span>
        </div>

        <div class="flex items-center space-x-12">
          <a href="/" class="hover:text-white">Home</a>
          <button on:click={logout} class="hover:text-white">Logout</button>
        </div>
      </div>

    <!-- hosted/played buttons -->
    </div>
    <div class="mr-8 mt-[-200px] flex justify-center items-center h-screen">
      <button on:click={() => togglePlayerHistory(playerEmail)} class="bg-purple-900 hover:bg-purple-700 text-white font-bold py-4 px-8 text-2xl rounded transition duration-150 ease-in-out{fadePlayedButton ? 'opacity-100' : ''}">Played</button>
      <div class="mx-12"></div>
      <button on:click={()=>toggleHostHistory(playerEmail)} class = "bg-purple-900 hover:bg-purple-700 text-white font-bold py-4 px-8 text-2xl rounded transition duration-150 ease-in-out{fadeHostedButton ? 'opacity-50' : ''}">Hosted</button>
    </div>

    <!-- player history display  -->
    <div class="mr-6 mt-[-170px] flex flex-col items-center h-screen">
      {#if showPlayerHistory}
        {#each detailedPlayerHistory as quiz}
          <div class="w-full md:w-1/2 mb-8">
            <div class="bg-purple-100 p-4 rounded shadow-md">
              <h3 class="text-2xl font-bold mb-6">{quiz.quiz} Quiz</h3>
              <span>You Scored: <span class="font-bold">{quiz.quizScore}</span></span>
              <ul ol class="mt-8 list-decimal pl-4">
                {#each quiz.details as detail}
                  <li class="mb-6">
                    <span class="text-lg">{detail.question}</span>
                    <div class="{detail.wasCorrect ? 'bg-green-400' : 'bg-red-400'} py-2 rounded mt-2">
                      <span class="ml-2">{detail.providedAnswer}</span>
                    </div>
                    <span class="ml-2">Solution: <span class="font-bold">{detail.correctAnswer}</span></span>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/each}
        <button on:click={deleteHistory} class="bg-red-700 hover:bg-red-500 text-white py-2 px-2 text-lg rounded transition duration-150 ease-in-out">Delete History</button>
      {/if}
    </div>

    <!-- host history display -->
    <div class = "mr-6 mt-[-550px] flex flex-col items-center h-screen">
      {#if showHostHistory}
        <div class="flex flex-wrap">
            {#each $hostHistory as quiz}
                <div class="bg-purple-100 p-4 rounded shadow-md">
                <h2 class="text-2xl font-bold mb-6">{quiz.quiz} Quiz Scores</h2>
                    <div class="mt-8">
                    {#each quiz.players as player}
                        <div class = "mb-6">
                            {player.name}: {player.score}</div>
                    {/each}
                    </div>
                </div>
            {/each}
        </div>
        <button on:click = {deleteHistory} class = "bg-red-700 hover:bg-red-500 text-white py-2 px-2 text-lg rounded transition duration-150 ease-in-out">Delete History</button>
        {/if}
  </div>

</body>
</main>
