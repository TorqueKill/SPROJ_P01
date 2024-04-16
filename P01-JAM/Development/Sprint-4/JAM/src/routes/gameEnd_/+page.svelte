<script>
  // @ts-nocheck
  import { SCREENS, AVATARS } from "$lib/config.js";
  import { user } from "$lib/userStore.js";
  import { socket, roomEvents } from "$lib/socketStore.js";
  import { goto } from "$app/navigation";
  import { saveHistory } from "$lib/API/gameAPI";

  import { onMount } from "svelte";

  // let playerScores = [];
  let totalQuestions = 0;
  let bgColor;
  let savingHistoryToCloud = false;

  let dummyPlayers = [
    {
      name: "Sawyer",
      scores: [1, 1, 1, 1, 1, 0, 1, 0, 0, 0],
      responseTimes: [6, 22, 29, 30, 44, 50, 53, 56, 93, 97],
      avatarIndex: 0,
    },
    {
      name: "Reese",
      scores: [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      responseTimes: [4, 7, 13, 42, 50, 52, 57, 62, 78, 93],
      avatarIndex: 1,
    },
    {
      name: "Taylor",
      scores: [0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
      responseTimes: [3, 5, 12, 21, 38, 39, 40, 45, 79, 81],
      avatarIndex: 2,
    },
    {
      name: "Robin",
      scores: [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      responseTimes: [1, 3, 7, 13, 27, 28, 29, 44, 58, 99],
      avatarIndex: 3,
    },
    {
      name: "Emerson",
      scores: [0, 1, 1, 1, 1, 0, 1, 1, 0, 0],
      responseTimes: [1, 22, 23, 33, 50, 66, 91, 92, 96, 97],
      avatarIndex: 4,
    },
    {
      name: "Quinn",
      scores: [0, 1, 1, 1, 1, 0, 1, 0, 1, 1],
      responseTimes: [1, 8, 48, 58, 67, 72, 73, 90, 91, 93],
      avatarIndex: 5,
    },
  ];

  let playerScores = dummyPlayers;

  onMount(() => {
    socket.emit("session-loaded", $user.gameid, SCREENS.SCORE);

    if ($user.bgColorIndex !== -1) {
      bgColor = $user.bgColor;
    } else {
      bgColor = DEFAULT_ROOM_SETTINGS.BG_COLOR;
    }
  });

  $: {
    const events = $roomEvents;
    console.log(events);

    if (events.roomDeleted) {
      socket.disconnect();
      socket.connect();

      $user.gameid = null;
      $user.quiz = null;
      $user.isHost = false;
      $user.userDecided = false;

      goto("/");
    }

    if (events.finalScores) {
      $user.score = events.finalScores;
      playerScores = $user.score;
      playerScores.sort(sortByScore);
      totalQuestions = playerScores[0].scores.length;
    }
  }

  const playerScore = (scoreList) => {
    let score = 0;
    for (let i = 0; i < scoreList.length; i++) {
      if (scoreList[i] == 1) {
        score++;
      }
    }
    return score;
  };

  const calculateScore = (scores) => {
    return scores.map((score, index) => {
      return {
        name: score.name,
        scores: playerScore(score.scores),
        avatarIndex: score.avatarIndex,
      };
    });
  };

  const sortByScore = (a, b) => {
    return playerScore(b.scores) - playerScore(a.scores);
  };

  const gotoViewHistory = () => {
    $user.gameid = null;
    $user.quiz = null;
    $user.isHost = false;
    $user.userDecided = false;

    goto("/viewHistory");
  };

  const _saveHistory = async () => {
    savingHistoryToCloud = true;

    if ($user.email == null || $user.email == "") {
      alert("Must be logged in to save history");
      savingHistoryToCloud = false;
      return;
    }

    //FOLLOWING SHOULD BE DONE ONLY IF DEV ACCOUNT: aka emails ending with '@dev'

    let localGames;

    if ($user.isHost) {
      localGames = JSON.parse(localStorage.getItem("hostGameHistory"));
    } else {
      localGames = JSON.parse(localStorage.getItem("playerGameHistory"));
    }

    if (localGames == null) {
      localGames = [];
    }

    let quiz = $user.quiz;
    let scores = $user.score;

    //if the user is a player, then replace the username in the scores with the player's email
    //first find the player's name in scores, then replace it with the email
    if (!$user.isHost) {
      for (let i = 0; i < scores.length; i++) {
        if (scores[i].name == $user.userName) {
          scores[i].name = $user.email;
          break;
        }
      }
    }

    let game = { quiz: quiz, scores: scores };
    let userGame = { email: $user.email, gameHistory: [game] };

    let found = false;

    //if $user.email is '@dev.test', then save the history in local storage
    //else save it using API : saveHistory

    if (!userGame.email.includes("@dev")) {
      try {
        let type = $user.isHost ? "host" : "player";
        let res = await saveHistory(userGame.email, userGame.gameHistory, type);
        console.log(res);
        savingHistoryToCloud = false;
        gotoViewHistory();
        return;
      } catch (error) {
        console.log(error);
        return;
      }
    }

    for (let i = 0; i < localGames.length; i++) {
      if (localGames[i].email == $user.email) {
        found = true;
        //check if the user has more than 5 games, pop the last element
        if (localGames[i].gameHistory.length >= 5) {
          localGames[i].gameHistory.pop();
        }
        localGames[i].gameHistory.push(game);
        break;
      }
    }

    if (!found) {
      localGames.push(userGame);
    }

    if ($user.isHost) {
      localStorage.setItem("hostGameHistory", JSON.stringify(localGames));
    } else {
      localStorage.setItem("playerGameHistory", JSON.stringify(localGames));
    }

    savingHistoryToCloud = false;
    gotoViewHistory();
  };

  const restartConnection = () => {
    socket.disconnect();
    socket.connect();

    $user.gameid = null;
    $user.quiz = null;
    $user.isHost = false;
    $user.userDecided = false;

    goto("/");
  };
</script>

<!-- <main>
    <body> -->
<div
  class="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 font-garamond"
>
  <!-- <h1>Game End</h1> -->
  <!--Display all scores, scores are sent via [0,1,0,1] where length = questions-->
  {#if playerScores.length == 0}
    <div class="fixed inset-0 bg-purple-500 flex justify-center items-center">
      <div class="loader" />
      <!-- Custom spinner -->
    </div>
    <p>Waiting for scores...</p>
  {:else if savingHistoryToCloud}
    <div class="fixed inset-0 bg-purple-500 flex justify-center items-center">
      <div class="loader" />
      <!-- Custom spinner -->
    </div>
    <p>Saving history...</p>
  {:else}
    <div
      class="min-h-screen {bgColor} text-white flex justify-center items-center"
    >
      <div>
        <div class="container mx-auto p-4 max-w-4xl">
          <!-- <div class=" bg-purple-900 p-8 rounded-lg shadow-lg max-w-4xl"> -->
          <div
            class="leaderboard bg-gradient-to-r from-purple-700 to-purple-900 p-8 rounded-lg shadow-lg max-w-4xl"
          >
            <h3 class="text-2xl font-bold mb-6 text-yellow-300">
              End of Game Leaderboard
            </h3>
            <div class="space-y-4">
              {#each calculateScore(playerScores) as player, index}
                <!-- <div class="flex items-center justify-between bg-purple-800 p-4 rounded-lg animate-pulse"> -->
                <div
                  class="flex items-center justify-between bg-gray-800 rounded-lg shadow-md animate-bounce"
                >
                  <!-- <div class="flex items-center"> -->
                  <div class="flex items-center space-x-4">
                    <img
                      src={`/avatars/${AVATARS[player.avatarIndex]}`}
                      alt="avatar"
                      class="w-12 h-12 rounded-full mr-4"
                    />
                    <div
                      class="text-lg font-medium {index < 3
                        ? 'text-yellow-400'
                        : 'text-gray-300'}"
                    >
                      {player.name}
                    </div>
                    <!-- <div class="text-lg font-medium text-white">{player.name}</div> -->
                  </div>
                  <div class="text-lg font-bold text-white">
                    {player.scores} points
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <div class="flex justify-center mt-4">
            <button
              class="bg-gradient-to-r from-purple-400 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
              on:click={async () => {
                _saveHistory();
              }}>Save history</button
            >
            <button
              class="px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
              on:click={() => {
                restartConnection();
              }}>Leave Room</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- </body>
  </main>  -->

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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .leaderboard-entries .flex.animate-bounce .text-white:nth-child(2) {
    /* Target name element */
    animation: text-glow 1.5s ease-in-out infinite alternate;
  }

  @keyframes text-glow {
    from {
      text-shadow: 0 0 0 #fff;
    }
    to {
      text-shadow: 0 0 5px #ffd700;
    }
  }

  .leaderboard {
    animation: slide-in 0.5s ease-in forwards;
  }

  @keyframes slide-in {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* .podium-container {
  /* Existing styles (flexbox layout, etc.) */
  /* } */

  /*  */

  /* .player-score {
  text-lg font-medium;
} */
</style>
