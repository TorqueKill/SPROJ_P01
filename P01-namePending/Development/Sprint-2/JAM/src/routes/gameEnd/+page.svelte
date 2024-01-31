<script>
  // @ts-nocheck
  import { SCREENS } from "$lib/config.js";
  import { user } from "$lib/userStore.js";
  import { socket, roomEvents } from "$lib/socketStore.js";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";

  let playerScores = [];
  let totalQuestions = 0;

  onMount(() => {

    //check if user is logged in. if not then redirect to landing page

    if ($user.email === "") {
      alert("Must be logged in to host or join a room");
      goto("/");
    }


    socket.emit("session-loaded", $user.gameid, SCREENS.SCORE);
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


  const saveHistory= ()=>{
    //check if the user is host or player
    //if host, save the scores in hostHistory in the local storage 
    //if player, save the scores in playerHistory in the local storage

    //format : 
    //{email: , username : , gameHistory: [{quiz: quiz, scores: playerScores}]}

    //if a user has more than 5 games, delete the oldest game (last element in the array)
    
    //also check if user is logged in or not (has an email)

    if ($user.email == null || $user.email == "") {
      alert("Must be logged in to save history");
      return false;
    }

    let localGames;

    if ($user.isHost){
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
    if (!$user.isHost){
      for (let i = 0; i < scores.length; i++) {
        if (scores[i].name == $user.userName) {
          scores[i].name = $user.email;
          break;
        }
      }
    }

    let game = {quiz: quiz, scores: scores};
    let userGame = {email: $user.email, gameHistory: [game]};

    let found = false;

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

    if ($user.isHost){
      localStorage.setItem("hostGameHistory", JSON.stringify(localGames));
    } else {
      localStorage.setItem("playerGameHistory", JSON.stringify(localGames));
    }

    return true;
  }

  const restartConnection = () => {
    socket.disconnect();
    socket.connect();

    $user.gameid = null;
    $user.quiz = null;
    $user.isHost = false;
    $user.userDecided = false;

    goto("/");
  }
</script>

<main>
  <body>
    <div class="container" id="inside-box">
      <h1>Game End</h1>
      <!--Display all scores, scores are sent via [0,1,0,1] where length = questions-->
      {#if playerScores.length == 0}
        <p>Waiting for scores...</p>
      {:else}
        <!-- {#each Object.entries(playerScores) as [idx, ps]}
          <p>
            {ps.name} score: {playerScore(ps.scores)}/{totalQuestions}
          </p>
        {/each} -->

        <div class="leaderboard">
          <h1>Leaderboard</h1>
          <table class="table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Score</th>
                <th>Correct Answers</th>
                <th>Wrong Answers</th>
                <th>Total Questions</th>
              </tr>
            </thead>
            <tbody>
              {#each playerScores as player}
                <tr class="player-card">
                  <td>{player.position}</td>
                  <td>{player.name}</td>
                  <td>{player.scores}</td>
                  <td>{player.correctAnswers}</td>
                  <td>{player.wrongAnswers}</td>
                  <td>{player.totalQuestions}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>


        <button
          class="btn btn-primary btn-block"
          id="hist"
          on:click={() => {
            if (saveHistory()){

              $user.gameid = null;
              $user.quiz = null;
              $user.isHost = false;
              $user.userDecided = false;

              goto("/viewHistory");
            };
          }}>Save history</button
        >
        <button
          class="btn btn-secondary btn-block"
          id="createQuiz"
          on:click={() => {
            restartConnection();
          }}>Leave Room</button
        >
      {/if}
    </div>
  </body>
</main>

<style>
  body {
    background: #7801a8;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: auto;
    max-width: 400px;
    margin: 0 auto;
    background-color: #018198;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 51px;
    overflow: hidden;
  }

  #inside-box {
    width: 100%;
    min-height: 30rem;
    padding: 1rem;
    box-sizing: border-box;
  }

  .btn-secondary,
  .btn-primary {
    width: auto;
    padding: 10px 15px;
    margin-bottom: 2rem;
    border-radius: 15px;
    border: none;
    background-color: #c49eff;
  }

  p {
    text-align: center;
    color: white;
    font-size: 20px;
  }

  .btn-secondary,
  .btn-primary,
  #hist {
    margin-left: 0;
    margin-right: 0;
    margin-top: 1rem;
    margin-bottom: 2rem;
    font-size: 15px;
  }

  .btn-secondary:hover {
    background-color: red;
  }
  #hist:hover {
    background-color: #7801a8;
  }

  @media screen and (max-width: 768px) {
    #inside-box {
      min-height: auto;
      padding: 10px;
    }

    .btn {
      width: 30%;
      margin-top: -5px;
      margin-bottom: 2rem;
    }
  }
</style>
