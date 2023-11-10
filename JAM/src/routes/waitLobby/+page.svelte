<script lang="js">
  // @ts-nocheck

  import { socket, socketEvents } from "$lib/socketStore.js";
  import { user } from "$lib/userStore.js";

  import { goto } from "$app/navigation";

  let playersReady = 0;
  let playerNames = [];

  $: {
    const events = $socketEvents;
    console.log(events);

    if (events.roomCreated) {
      $user.gameid = events.roomCreated;
    }

    if (events.roomJoined) {
      playersReady = events.roomJoined.num;
      playerNames = events.roomJoined.names;
    }

    if (events.roomLeft) {
      playersReady = events.roomLeft.num;
      playerNames = events.roomLeft.names;
    }

    if (events.gameStarted) {
      $user.quiz = events.gameStarted;
      console.log($user.quiz);
      goto("/gameSession");
    }
  }
</script>

<main>
  <body>
    <h1>Waiting for the players to join...</h1>
    <div class="container">
      <div
        class="container mt-4 mb-5 d-flex justify-content-center"
        id="inside-box"
      >
        <div class="player-div">
          <div>
            <p id="players-ready">Players Ready</p>
            <p id="player-number">{playersReady}</p>
          </div>
        </div>
        {#if $user.isHost}
          <!-- <h4>Host id: {$user.gameid}</h4> -->
          <div class="player-div">
            <div>
              <p id="host-id">Host ID</p>
              <p id="game-id">{$user.gameid}</p>
              <!-- <p id="game-id">1234345</p> -->
            </div>
          </div>
        {/if}

        {#if playerNames.length >= 1}
          {#each playerNames as name}
            <h4>{name}</h4>
          {/each}
        {/if}

        <!--Go back to menu, disconnect-->
        <button
          class="btn btn-secondary btn-block"
          id="createQuiz"
          on:click={() => {
            socket.disconnect();
            socket.connect();
            goto("/");
          }}>Leave room</button
        >
      </div>
    </div>
  </body>
</main>

<style>
  body {
    background: #7801a8;
  }
  .container {
    margin-top: 8rem;
    margin-left: 17rem;
  }
  #inside-box {
    width: 20rem;
    height: 20rem;
    background: #c49eff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 51px;
    padding-top: 5rem;
  }
  #players-ready {
    color: white;
    font-size: 15px;
    font-family: JejuGothic, sans-serif;
    font-weight: 400;
    margin-left: -4rem;
    transform: translate(0, 75%);
  }
  #player-number {
    padding-top: -1rem;
    text-align: center;
    transform: translate(0, -110%);
    color: white;
    margin-left: 9rem;
  }
  .player-div {
    width: 12rem;
    height: 3rem;
    background: #00a59b;
    text-align: center;
    border-radius: 12px;
    margin-left: 4rem;
  }
  .btn {
    margin-top: 5rem;
    margin-right: 6rem;
    width: 10rem;
    border: None;
    font-family: JejuGothic, sans-serif;
    border-radius: 12px;
    height: 3rem;
    font-size: 20px;
  }
  .btn:active {
    background-color: #7801a8;
    color: #f0e9e9;
  }
  .btn-secondary {
    background: #c70000;
    border: None;
    margin-top: 4rem;
    margin-left: 5rem;
    font-size: 20px;
    color: white;
    font-family: JejuGothic, sans-serif;
  }
  #host-id {
    color: white;
    font-size: 15px;
    font-family: JejuGothic, sans-serif;
    font-weight: 400;
    margin-left: -7rem;
    transform: translate(0, 75%);
  }
  #game-id {
    color: white;
    padding-top: -1rem;
    text-align: center;
    transform: translate(0, -110%);
    margin-left: 7rem;
  }
  h1 {
    color: white;
    font-size: 36px;
    font-family: JejuGothic;
    font-weight: 400;
    margin-left: 30rem;
    margin-top: 5rem;
  }
</style>
