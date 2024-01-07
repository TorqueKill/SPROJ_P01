<script>
  // @ts-nocheck
  import { SCREENS } from "$lib/constants.js";
  import { user } from "$lib/userStore.js";
  import { socket, roomEvents } from "$lib/socketStore.js";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";

  let playerScores = [];
  let totalQuestions = 0;

  onMount(() => {
    socket.emit("session-loaded", $user.gameid, SCREENS.SCORE);
  });

  $: {
    const events = $roomEvents;
    console.log(events);

    if (events.roomDeleted) {
      socket.disconnect();
      socket.connect();
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
</script>

<main>
  <body>
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
          class="btn btn-primary btn-block"
          id="hist"
          on:click={() => {
            goto("/dummyViewHistory");
          }}>View history</button
        >
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
