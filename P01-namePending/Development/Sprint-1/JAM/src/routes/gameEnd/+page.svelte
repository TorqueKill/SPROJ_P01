<script >
  // @ts-nocheck
  import { SCREENS } from "$lib/config.js";
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
    <h1 id="home">JAM</h1>
    <div class="container2" id="inside-box">
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
        class="btn-primary btn-block"
        id = "hist"
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
  .container2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    border-radius: 15px;
    background-color: #018198;
    color: #c49eff;
    border: none;
    margin-top: 20rem;
  }
  .btn-secondary {
    background: #c70000;
    border: None;
    margin-left: 5rem;
    font-size: 20px;
    color: white;
    font-family: JejuGothic, sans-serif;
  }
  .btn-primary 
  {
    background: rgb(158, 146, 146)85;
    border: None;
    margin-left: 6rem;
    font-size: 20px;
    color: white;
    margin-top: 5rem;
    font-family: JejuGothic, sans-serif;
  }
  .btn {
    margin-top: 10rem;
    margin-right: 6rem;
    width: 10rem;
    border: None;
    font-family: JejuGothic, sans-serif;
    border-radius: 12px;
    height: 3rem;
    font-size: 20px;
  }
  #hist
  {
    margin-top: 5rem;
    margin-bottom: -10rem;
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

  @media screen and (max-width: 768px) {
  .container {
    margin-left: 5rem;
  }
  
  .btn {
    padding: 10px;
    font-size: 14px;
    border-radius: 10px;
  }
 
 }

 @media screen and (min-width: 769px) {
  .btn {
    padding: 10px 25px;
    font-size: 18px;
    border-radius: 20px;
  }
 }
</style>
