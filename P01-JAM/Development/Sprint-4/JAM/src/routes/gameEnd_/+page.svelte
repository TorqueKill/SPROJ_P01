<script>
    // @ts-nocheck
    import { SCREENS, AVATARS, GAME_SETTINGS } from "$lib/config.js";
    import { user } from "$lib/userStore.js";
    import { socket, roomEvents } from "$lib/socketStore.js";
    import { goto } from "$app/navigation";
    import { saveHistory } from "$lib/API/gameAPI";
  
    import { onMount } from "svelte";
  
    // let playerScores = [];
    let totalQuestions = 0;
    let bgColor;
    const LEADERBOARD_SIZE = GAME_SETTINGS.LEADERBOARD_SIZE;

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

    // const calculateScore = (scores) => {
    //   return scores.map((score, index) => {
    //     return {
    //       name: score.name,
    //       scores: playerScore(score.scores),
    //       avatarIndex: score.avatarIndex
    //     };
    //   });
    // };

    const calculateScore =(scores) => {
        let scoreList = [];
        for (let i = 0; i < scores.length; i++) {
        let score = 0;
        for (let j = 0; j < scores[i].scores.length; j++) {
            //make sure to convert the responseTimes to integer from float
            score += scores[i].scores[j] * Math.floor(scores[i].responseTimes[j]);
        }
        scoreList.push({name: scores[i].name, scores: score, avatarIndex: scores[i].avatarIndex});
        }
        //sort the list by score
        scoreList.sort((a, b) => b.scores - a.scores);
        
        //check if the list is greater than the leaderboard size
        if (scoreList.length > LEADERBOARD_SIZE) {
            scoreList = scoreList.slice(0, LEADERBOARD_SIZE);
        }
        return scoreList;
    }

    const calculateFirstPosition = (scores) => {

        let secondPositionPlayer = scores[0];
        
        return {
            name: secondPositionPlayer.name,
            scores: playerScore(secondPositionPlayer.scores),
            avatarIndex: secondPositionPlayer.avatarIndex
        };
    };

    const calculateSecondPosition = (scores) => {
      
        let secondPositionPlayer = scores[1];
        
        return {
            name: secondPositionPlayer.name,
            scores: playerScore(secondPositionPlayer.scores),
            avatarIndex: secondPositionPlayer.avatarIndex
        };
        
    };

    const calculateThirdPosition = (scores) => {

        let secondPositionPlayer = scores[2];
        
        return {
            name: secondPositionPlayer.name,
            scores: playerScore(secondPositionPlayer.scores),
            avatarIndex: secondPositionPlayer.avatarIndex
        };
    };

     
  
    const sortByScore = (a, b) => {
      return playerScore(b.scores) - playerScore(a.scores);
    };
  
    const _saveHistory = async () => {
      //check if the user is host or player
      //further check if its a dev account or not
  
      //if DEV:
      //if host, save the scores in hostHistory in the local storage
      //if player, save the scores in playerHistory in the local storage
  
      //if not DEV:
      //save the scores on supabase
  
      //format :
      //{email: , username : , gameHistory: [{quiz: quiz, scores: playerScores}]}
  
      //if a user has more than 5 games, delete the oldest game (last element in the array)
  
      //also check if user is logged in or not (has an email)
      
  
      if ($user.email == null || $user.email == "") {
        alert("Must be logged in to save history");
        return false;
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
  
          return true;
        } catch (error) {
          console.log(error);
          return false;
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
  
      return true;
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
    <body>
      <div> -->
        <!-- <h1>Game End</h1> -->
        <!--Display all scores, scores are sent via [0,1,0,1] where length = questions-->
        {#if playerScores.length == 0}
          <div class="fixed inset-0 bg-purple-500 flex justify-center items-center">
            <div class="loader"></div> <!-- Custom spinner -->
          </div>
          <p>Waiting for scores...</p>
        {:else}
        <div class="min-h-screen {bgColor} text-white flex justify-center items-center">
            <div>
            <div class="container mx-auto p-4 max-w-8xl">

                <!-- <div class="podium-container flex justify-between items-center w-fit mx-auto">
                    {#each calculateScore(playerScores) as player, index}
                      <div class="podium {index === 1 ? 'first-place' : index === 2 ? 'second-place' : index === 3 ? 'third-place' : 'hidden'} bg-gradient-to-r from-gold-500 to-gold-700 rounded-lg shadow-lg p-4">
                        <img src={`/avatars/${AVATARS[player.avatarIndex]}`} alt="avatar" class="w-12 h-12 rounded-full mx-auto mb-2">
                        <div class="player-name text-lg font-bold">{player.name}</div>
                        <div class="player-score text-lg font-medium">{player.scores} points</div>
                      </div>
                    {/each}
                </div> -->


                <!-- <div class="container mx-auto p-4 max-w-8xl"> -->
                <div class=" bg-purple-900 p-16 rounded-lg shadow-lg max-w-16xl">
                  <h3 class="text-2xl font-bold mb-6 text-yellow-300">Leaderboard</h3>
                  <div class="space-y-4">
                      {#each calculateScore(playerScores) as player, index}
                      <div class="flex items-center justify-between bg-purple-800 p-2 rounded-lg">
                          <div class="flex items-center p-2">
                              <img src={`/avatars/${AVATARS[player.avatarIndex]}`} alt="avatar" class="w-12 h-12 rounded-full mr-4">
                              <div class="text-lg font-medium {index < 3 ? 'text-yellow-400' : 'text-gray-300'}">{player.name}</div>
                          </div>
                          <div class="text-lg font-bold  {index < 3 ? 'text-white' : 'text-gray-400'}">{player.scores} points</div>
                      </div>
                      {/each}
                  </div>
                  <!-- <div class="w-full bg-purple-700 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden mb-2 mt-2">
                      <div class="bg-green-500 h-full" style="transition: width 0.5s ease; width: {scoreDisplayTimerWidth}%"></div>
                  </div> -->
              </div>
              <!-- </div> -->


                <!-- <div class=" bg-purple-900 p-8 rounded-lg shadow-lg max-w-4xl"> -->
                <!-- <div class="leaderboard bg-gradient-to-r from-purple-700 to-purple-900 p-32 rounded-lg shadow-lg max-w-4xl">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-300 absolute top-10 ">Podium</h3>
                    <div class="space-x-4 flex justify-center items-center">

                        <div class="podium">
                            <div>
                                
                                {#if playerScores.length > 1 }
                                  <div class="flex-row items-center justify-between bg-gray-800 rounded-lg shadow-md animate-bounce w-100 h-500 mx-6">
                                      <img src={`/avatars/${AVATARS[calculateSecondPosition(playerScores).avatarIndex]}`} alt="avatar" class="w-12 h-12 rounded-full mr-4">
                                      <div class="text-lg font-medium ">{calculateSecondPosition(playerScores).name}</div>
                                      <div class="text-lg font-bold text-white">{calculateSecondPosition(playerScores).scores} points</div>
                                  </div>
                                
                                
                                <div class="podium-place second">2nd Place</div>
                                {/if}

                            </div>

                            <div>
                                
                                <div class="flex-row items-center justify-between bg-gray-800 rounded-lg shadow-md animate-bounce w-100 h-500 mx-6">
                                    <img src={`/avatars/${AVATARS[calculateFirstPosition(playerScores).avatarIndex]}`} alt="avatar" class="w-12 h-12 rounded-full mr-4">
                                    <div class="text-lg font-medium ">{calculateFirstPosition(playerScores).name}</div>
                                    <div class="text-lg font-bold text-white">{calculateFirstPosition(playerScores).scores} points</div>
                                </div>
                                
                                <div class="podium-place first">1st Place</div>

                            </div>
                            
                            <div>
                                
                                {#if playerScores.length > 2}
                                <div class="flex-row items-center justify-between bg-gray-800 rounded-lg shadow-md animate-bounce w-100 h-500 mx-6">
                                    <img src={`/avatars/${AVATARS[calculateThirdPosition(playerScores).avatarIndex]}`} alt="avatar" class="w-12 h-12 rounded-full mr-4">
                                    <div class="text-lg font-medium ">{calculateThirdPosition(playerScores).name}</div>
                                    <div class="text-lg font-bold text-white">{calculateThirdPosition(playerScores).scores} points</div>
                                </div>
                                

                                <div class="podium-place third">3rd Place</div>
                                {/if}

                            </div>
                        
                        </div>
                        
                        
                    </div> -->
                <!-- </div> -->
                <!-- </div> -->
        
            <!-- <div class="flex justify-around mt-10"> -->

                <div class="flex justify-center mt-4">  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" on:click={async () => {
                  const result = await _saveHistory();
                  if (result) {
                      $user.gameid = null;
                      $user.quiz = null;
                      $user.isHost = false;
                      $user.userDecided = false;
              
                      goto("/viewHistory");
                  }else{
                      alert("There was an error saving the history. Please try again!");
                  }
                  }}>Save history</button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-4" on:click={() => {
                      restartConnection();
                      }}>Leave Room</button>
                </div>
                
                <!-- <div class="flex flex-col space-y-2">  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save history</button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Leave Room</button>
                </div> -->
          
                <!-- <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                    on:click={async () => {
                    const result = await _saveHistory();
                    if (result) {
                        $user.gameid = null;
                        $user.quiz = null;
                        $user.isHost = false;
                        $user.userDecided = false;
                
                        goto("/viewHistory");
                    }else{
                        alert("There was an error saving the history. Please try again!");
                    }
                    }}>Save history</button
                > -->
                <!-- <button
                    class="btn btn-secondary btn-block"
                    id="createQuiz"
                    on:click={() => {
                    restartConnection();
                    }}>Leave Room</button
                > -->

                <!-- <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded" on:click={() => {restartConnection();}}>
                    Leave Room
                </button> -->
            <!-- </div> -->
        </div>  
        </div>
        </div>
        {/if}
        
      <!-- </div>
    </body>
  </main> -->







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

    .leaderboard-entries .flex.animate-bounce .text-white:nth-child(2) { /* Target name element */
      animation: text-glow 3.5s ease-in-out infinite alternate;
    }

    @keyframes text-glow {
      from { text-shadow: 0 0 0 #fff; }
      to { text-shadow: 0 0 5px #ffd700; }
    }

    .leaderboard {
      animation: slide-in 2.5s ease-in forwards;
    }

    @keyframes slide-in {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .podium {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* background-color: #ddd; */
  padding: 20px;
  border-radius: 10px;
}

.podium-place {
  width: 150px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size: 20px;
  margin-bottom: 10px;
  /* background-color: #eee; */
  border: 2px solid #ccc;
  border-radius: 5px;
}

.podium-place.first {
  background-color: rgba(255, 217, 0, 0.777);
  /* transform: scaleY(1.5);
  transform-origin:bottom; */
  margin-right: 10px;
  margin-left: 10px;
  height: 150px;
}

.podium-place.second {
  background-color: rgba(192, 192, 192, 0.852);
}

.podium-place.third {
  background-color:rgba(205, 134, 63, 0.878);
  height: 65px;
  margin-bottom: 0px;
}

    /* .podium-container {
  /* Existing styles (flexbox layout, etc.) */
/* } */ 

/*  */

/* .player-score {
  text-lg font-medium;
} */
</style>