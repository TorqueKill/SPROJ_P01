<script>
  // @ts-nocheck
  
    import { onMount } from 'svelte';
    import { gameHistory, gameHistHost, gameHistPlayer } from "$lib/dummyGames";
    import { writable } from "svelte/store";
    import { goto } from "$app/navigation";
    import {getHistory} from '$lib/API/gameAPI'
    import {user} from '$lib/userStore'
    import {HISTORY_DISPLAY_PAGINATION_HOST,HISTORY_DISPLAY_PAGINATION_PLAYER} from '$lib/config'
  
    let pagesize_Host = HISTORY_DISPLAY_PAGINATION_HOST;
    let pagesize_Player = HISTORY_DISPLAY_PAGINATION_PLAYER;
    let currentpage_Host = 1;
    let currentpage_Player = 1;
    let totalpage_Host = 0;
    let totalpage_Player = 0;
  
    let playerPageLoading = false
  
  
    let pageLoading = [false,false,false]; // whole page loading, player history loading, host history loading
    let loadedDefault_Host = false;
    let loadedDefault_Player = false;
  
    let statsPage = [false,false] //one for player stats, one for host stats
    let statsPageLoading = [false,false] //one for player stats, one for host stats
  
    
  
  
    // dummy email
    let playerEmail;
  
    // let playerEmail = $user.email;
  
  
    let detailedPlayerHistory = [];
    let hostHistory = [];
  
    let showPlayerHistory = false;
    let showHostHistory = false;
  
    let fadePlayedButton = false;
    let fadeHostedButton = false;
  
    let localPlayerHistory;
    let localHostHistory;
  
    onMount(async() => {
  
  
    if ($user.email == null || $user.email == "") {
      alert("Must be logged in to view history");
      goto("/");
    }

    playerEmail = $user.email;
    pageLoading[0] = true;
  
    //localPlayerHistory = JSON.parse(localStorage.getItem("playerGameHistory"));
    if (localPlayerHistory == null) {
      localPlayerHistory = [];
    }
  
    //fetch player history
    let res = await getHistory(playerEmail, currentpage_Player, pagesize_Player, "player");
    localPlayerHistory = res.history;
    totalpage_Player = Math.ceil(res.total/pagesize_Player);
  
    if (localPlayerHistory.length == 0) {
        localPlayerHistory = gameHistPlayer;
        loadedDefault_Player = true;
      }
  
    //localHostHistory = JSON.parse(localStorage.getItem("hostGameHistory"));
    if (localHostHistory == null) {
      localHostHistory = [];
    }
  
    //fetch host history
    res = await getHistory(playerEmail, currentpage_Host, pagesize_Host, "host");
    localHostHistory = res.history;
    //note these are total items, we need to convert to total pages
    totalpage_Host =  Math.ceil(res.total/pagesize_Host);
  
    if (localHostHistory.length == 0) {
        localHostHistory = gameHistHost;
        loadedDefault_Host = true;
      }
  
    console.log("localPlayerHistory:", localPlayerHistory);
    console.log("localHostHistory:", localHostHistory);
  
    pageLoading[0] = false;
  
    });
  
    async function NextPage_Host() {
        pageLoading[2] = true;
        if (currentpage_Host < totalpage_Host) {
            currentpage_Host++;
            let response = await getHistory(playerEmail, currentpage_Host, pagesize_Host, "host");
            if (response && response.history) {
                localHostHistory = response.history;
                detailedPlayerHistory = getDetailedPlayerHistory(playerEmail);
                console.log("Host history:", response.history);
            } else {
                console.error("Failed to fetch host history or history is undefined");
            }
        }
        pageLoading[2] = false;
    }
  
    async function PrevPage_Host() {
        pageLoading[2] = true;
        if (currentpage_Host > 1) {
            currentpage_Host--;
            let response = await getHistory(playerEmail, currentpage_Host, pagesize_Host, "host");
            if (response && response.history) {
                localHostHistory = response.history;
                detailedPlayerHistory = getDetailedPlayerHistory(playerEmail);
                console.log("Host history:", response.history);
            } else {
                console.error("Failed to fetch host history or history is undefined");
            }
        }
        pageLoading[2] = false;
    }
  
    async function NextPage_Player() {
        pageLoading[1] = true;
        if (currentpage_Player < totalpage_Player) {
            currentpage_Player++;
            let response = await getHistory(playerEmail, currentpage_Player, pagesize_Player, "player");
            if (response && response.history) {
                localPlayerHistory = response.history;
                detailedPlayerHistory = getDetailedPlayerHistory(playerEmail);
                console.log("res:", response.history);
            } else {
                console.error("Failed to fetch history or history is undefined");
            }
        }
        pageLoading[1] = false;
    }
  
    async function PrevPage_Player() {
      pageLoading[1] = true;
      if (currentpage_Player > 1) {
        currentpage_Player--;
        let response = await getHistory(playerEmail, currentpage_Player, pagesize_Player, "player");
        if (response && response.history) {
            localPlayerHistory = response.history;
            detailedPlayerHistory = getDetailedPlayerHistory(playerEmail);
            console.log("res:", response.history);
        } else {
            console.error("Failed to fetch history or history is undefined");
        }
      }
      pageLoading[1] = false;
    }
  
  
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
      const players = localPlayerHistory.filter(player => player.email === email); 
      console.log("player:", players);
      if (players) {
        return players.flatMap( player => player.gameHistory.map(game => ({
          quiz: game.quiz.title,
          quizScore: game.scores.find(score => score.name === email).scores.reduce((acc, cur) => acc + cur, 0),
          details: game.quiz.quiz.map((question, index) => ({
            question: question.question,
            providedAnswer: game.scores.find(score => score.name === email).scores[index] ? game.quiz.quiz[index].choices[game.scores.find(score => score.name === email).scores[index]] : 'Wrong Answer',
            correctAnswer: game.quiz.quiz[index].answer,
            wasCorrect: game.scores.find(score => score.name === email).scores[index] === 1
          }))
        })));
  
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
  
    hostHistory = getHostHistory(email); 
    }
  
    // Function to retrieve detailed host history based on email
  
    function getHostHistory(email) {
    //find all games hosted by host
    const hostArr = localHostHistory.filter(host => host.email === email);
    console.log("host:", hostArr); 
    if (hostArr) {
      return hostArr.flatMap(host => host.gameHistory.map(game => ({
        quiz: game.quiz.title,
        players: game.scores.map(player => ({
          name: player.name,
          score: player.scores.reduce((acc, cur) => acc + cur, 0)
        }))
      })));
    } else {
      alert("No history to show");
      showHostHistory = !showHostHistory;
      return [];
    }
    }
  
    function deleteHistory() {
      detailedPlayerHistory = [];
      hostHistory = [];
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
  
    {#if pageLoading[0]}
    <div class="fixed inset-0 bg-purple-500 flex justify-center items-center">
      <div class="loader"></div>
    </div>
    {:else}
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
      {#if pageLoading[1]}
        <div class="fixed inset-0 bg-purple-500 flex justify-center items-center">
          <div class="loader"></div>
        </div>
      {:else}
        <div class="mr-6 mt-[-170px] flex flex-col items-center min-h-screen">
          {#if showPlayerHistory}
            {#each detailedPlayerHistory as quiz}
              <div class="w-full md:w-1/2 mb-8 ">
                <div class="bg-purple-300 p-4 rounded shadow-md">
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
            <!-- <button on:click={deleteHistory} class="bg-red-700 hover:bg-red-500 text-white py-2 px-2 text-lg rounded transition duration-150 ease-in-out">Delete History</button> -->
          {/if}
          
          {#if !loadedDefault_Player && showPlayerHistory}
            <!--Pagination-->
            <div class="flex justify-center items-center mt-8">
              <button class="bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 text-lg rounded transition duration-150 ease-in-out w-50" on:click={PrevPage_Player}>Previous</button>
              <span class="mx-4 text-lg">Page {currentpage_Player} of {totalpage_Player}</span>
              <button class="bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 text-lg rounded transition duration-150 ease-in-out w-50" on:click={NextPage_Player}>Next</button>
            </div>
          {/if}
  
  
        </div>
      {/if}
  
      <!-- host history display -->
      {#if pageLoading[2]}
        <div class="fixed inset-0 bg-purple-500 flex justify-center items-center">
          <div class="loader"></div>
        </div>
      {:else}
        <div class = "mr-6 mt-[-550px] flex flex-col items-center min-h-screen">
          {#if showHostHistory}
            <div class="flex flex-col space-y-4">
              {#each hostHistory as quiz}
                <div class="relative">
                  <div class="absolute top-0 left-0 w-full h-8"></div>
                    <div class="bg-purple-800 text-white p-4 rounded shadow-md relative">
                      <h2 class="text-2xl font-bold mb-6">{quiz.quiz} Quiz Scores</h2>
                    </div>
                    <div class="bg-white p-4 rounded-b shadow-md relative z-10">
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <h3 class="text-lg font-semibold mb-4">Players</h3>
                            {#each quiz.players as player}
                              <div class="mb-2">{player.name}</div>
                            {/each}
                          </div>
                          <div>
                            <h3 class="text-lg font-semibold mb-4">Scores</h3>
                            {#each quiz.players as player}
                              <div class="mb-2">{player.score}</div>
                            {/each}
                          </div>
                        </div>
                      </div>
                    </div>
                {/each}
            </div>
            <!-- <button on:click = {deleteHistory} class = "bg-red-700 hover:bg-red-500 text-white py-2 px-2 text-lg rounded transition duration-150 ease-in-out">Delete History</button> -->
            {/if}
  
            {#if !loadedDefault_Host && showHostHistory}
              <!--Pagination-->
              <div class="flex justify-center items-center mt-8">
                <button class="bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 text-lg rounded transition duration-150 ease-in-out" on:click={PrevPage_Host}>Previous</button>
                <!--display curr page / total -->
                <span class="mx-4">{currentpage_Host}/{totalpage_Host}</span>
                <button class="bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 text-lg rounded transition duration-150 ease-in-out" on:click={NextPage_Host}>Next</button>
              </div>
            {/if}
        </div>
      {/if}
  
    </body>
    {/if}
  </main>
  
  
  
  <style>
    /* Simple CSS spinner animation */
    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #600e74; /* You can change the color to match your brand */
      border-radius: 50%;
      width: 64px; /* You can adjust the size */
      height: 64px; /* You can adjust the size */
      animation: spin 2s linear infinite;
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  