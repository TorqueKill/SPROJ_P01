<script>
  // @ts-nocheck

  import { onMount } from "svelte";
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
    console.log("detailedPlayerHistory:", detailedPlayerHistory);
  }

  // Function to retrieve detailed player history based on email
  function getDetailedPlayerHistory(email) {
    const players = localPlayerHistory.filter(
      (player) => player.email === email
    );
    console.log("player:", players);
    if (players) {
      return players.flatMap((player) =>
        player.gameHistory.map((game) => ({
          quiz: game.quiz.title,
          quizScore: game.scores
            .find((score) => score.name === email)
            .scores.reduce((acc, cur) => acc + cur, 0),
          details: game.quiz.quiz.map((question, index) => ({
            question: question.question,
            providedAnswer: game.scores.find((score) => score.name === email)
              .scores[index]
              ? game.quiz.quiz[index].choices[
                  game.scores.find((score) => score.name === email).scores[
                    index
                  ]
                ]
              : "No answer provided",
            correctAnswer: game.quiz.quiz[index].answer,
            wasCorrect:
              game.scores.find((score) => score.name === email).scores[
                index
              ] === 1,
          })),
        }))
      );
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
    //find all games hosted by host
    const hostArr = localHostHistory.filter((host) => host.email === email);
    console.log("host:", hostArr);
    if (hostArr) {
      return hostArr.flatMap((host) =>
        host.gameHistory.map((game) => ({
          quiz: game.quiz.title,
          players: game.scores.map((player) => ({
            name: player.name,
            score: player.scores.reduce((acc, cur) => acc + cur, 0),
          })),
        }))
      );
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

      goto("/signIn");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
</script>

<!-- 
<div class="navbar mx-auto px-4 flex justify-between items-center">
  <div>
    <a
      href="/hostOrPlayer"
      class="px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
      >Back</a
    >
  </div>


  <div class="flex items-center space-x-12">
    <a
      href="/"
      class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
      >Home</a
    >
    <button
      on:click={logout}
      class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
      >Logout</button
    >
  </div>
</div> -->

<nav
  class="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 p-4 fixed top-0 w-full z-50 shadow-lg font-garamond"
>
  <div class="container mx-auto flex justify-between items-center">
    <div class="text-2xl font-bold text-white">JAM</div>
    <div class="text-4xl font-bold text-white items-center">View History</div>
    <ul class="flex space-x-4">
      <li>
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          on:click={() => goto("/")}
        >
          Home
        </button>
      </li>

      <li>
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          on:click={logout}
        >
          Logout
        </button>
      </li>
    </ul>
  </div>
</nav>

<main>
  <body class="bg-purple-500 font-garamond">
    <div>
      <!-- hosted/played buttons -->
    </div>
    <div class="mr-8 mt-[-200px] flex justify-center items-center h-screen">
      <button
        on:click={() => togglePlayerHistory(playerEmail)}
        class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg
        {fadePlayedButton ? 'opacity-100' : ''}">Played</button
      >
      <div class="mx-12" />
      <button
        on:click={() => toggleHostHistory(playerEmail)}
        class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg
        {fadeHostedButton ? 'opacity-50' : ''}">Hosted</button
      >
    </div>

    <!-- player history display  -->
    <div class="mr-6 mt-[-170px] flex flex-col items-center min-h-screen">
      {#if showPlayerHistory}
        {#each detailedPlayerHistory as quiz}
          <div class="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl text-center max-w-md w-full mx-auto">
            <div class="bg-purple-100 p-4 rounded shadow-md">
              <h3 class="text-2xl font-bold mb-6">{quiz.quiz} Quiz</h3>
              <span
                >You Scored: <span class="font-bold">{quiz.quizScore}</span
                ></span
              >
              <ul ol class="mt-8 list-decimal pl-4">
                {#each quiz.details as detail}
                  <li class="mb-6">
                    <span class="text-lg">{detail.question}</span>
                    <div
                      class="{detail.wasCorrect
                        ? 'bg-green-400'
                        : 'bg-red-400'} py-2 rounded mt-2"
                    >
                      <span class="ml-2">{detail.providedAnswer}</span>
                    </div>
                    <span class="ml-2"
                      >Solution: <span class="font-bold"
                        >{detail.correctAnswer}</span
                      ></span
                    >
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/each}
        <button
          on:click={deleteHistory}
          class="px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
          >Delete History</button
        >
      {/if}
    </div>

    <!-- host history display -->
    <div class="mr-6 mt-[-550px] flex flex-col items-center min-h-screen">
      {#if showHostHistory}
        <div class="flex flex-wrap">
          {#each $hostHistory as quiz}
            <div class="bg-purple-100 p-4 rounded shadow-md">
              <h2 class="text-2xl font-bold mb-6">{quiz.quiz} Quiz Scores</h2>
              <div class="mt-8">
                {#each quiz.players as player}
                  <div class="mb-6">
                    {player.name}: {player.score}
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
        <button
          on:click={deleteHistory}
          class="px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
          >Delete History</button
        >
      {/if}
    </div>
  </body>
</main>
