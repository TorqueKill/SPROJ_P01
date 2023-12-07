<script >
  // @ts-nocheck
  import { SCREENS } from "$lib/constants.js";
  import { user } from "$lib/userStore.js";
  import { socket, socketEvents } from "$lib/socketStore.js";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";

  let playerScores = [];
  let totalQuestions = 0;

  $: {
    const events = $socketEvents;
    console.log(events);

    if (events.finalScores) {
      $user.score = events.finalScores;
      playerScores = $user.score;
      totalQuestions = playerScores[0].scores.length;
    }
  }

  onMount(() => {
    //eg = [[1,0,1,0], [0,1,0,1]...] where of 1 list = questions
    socket.emit("session-loaded", $user.gameid, SCREENS.SCORE);
  });

  const playerScore = (scoreList) => {
    let score = 0;
    for (let i = 0; i < scoreList.length; i++) {
      if (scoreList[i] == 1) {
        score++;
      }
    }
    return score;
  };
</script>

<main>
  <body>
    <h1 id="home">JAM</h1>
    <div class="container" id="inside-box">
      <h1>Game End</h1>
      <!--Display all scores, scores are sent via [0,1,0,1] where length = questions-->
      {#if playerScores.length == 0}
        <p>Waiting for scores...</p>
      {:else}
        {#each Object.entries(playerScores) as [idx, ps]}
          <p>
            {ps.name} score: {playerScore(ps.scores)}/{totalQuestions}
          </p>
        {/each}

        <button
          class="btn btn-secondary btn-block"
          id="createQuiz"
          on:click={() => {
            socket.disconnect();
            socket.connect();
            goto("/");
          }}>Leave Room</button
        >
      {/if}
    </div>
  </body>
</main>

<style>
  body {
    background: #7801a8;
  }
  #home {
    color: #f0e9e9;
    font-family: JejuGothic, sans-serif;
    font-size: 36px;
    margin-left: 5rem;
    margin-top: 4rem;
  }
  .container {
    margin-top: 5rem;
    margin-left: 34rem;
  }
  #inside-box {
    width: 20rem;
    height: 30rem;
    background: #c49eff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 51px;
    padding-top: 3rem;
  }
  h1 {
    color: white;
    margin-left: 5rem;
    margin-top: -0.75rem;
    font-family: JejuGothic, sans-serif;
  }
  .btn-secondary {
    background: #c70000;
    border: None;
    margin-top: 8rem;
    margin-left: 5rem;
    font-size: 20px;
    color: white;
    font-family: JejuGothic, sans-serif;
  }
  .btn {
    margin-top: 15rem;
    margin-right: 6rem;
    width: 10rem;
    border: None;
    font-family: JejuGothic, sans-serif;
    border-radius: 12px;
    height: 3rem;
    font-size: 20px;
  }
  .btn:active {
    background-color: #8b0000;
    color: #f0e9e9;
    font-family: JejuGothic, sans-serif;
  }
  p {
    color: #02625c;
    margin-left: 5.3rem;
    font-family: JejuGothic, sans-serif;
    font-size: 18px;
  }
</style>
