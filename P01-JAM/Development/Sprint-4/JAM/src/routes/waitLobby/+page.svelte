<script lang="js">
  // @ts-nocheck

  //------------------------------------PRESISTANCE------------------------------------
  // navigate to main menu if user is disconnected, if user is not logged in, goto login/signup

  import { socket, roomEvents } from "$lib/socketStore.js";
  import { user } from "$lib/userStore.js";
  import { SCREENS, AVATARS } from "$lib/config.js";
  import { goto } from "$app/navigation";

  let playersReady = 0;
  let players = [];

  $: {
    const events = $roomEvents;
    console.log(events);

    if (events.roomDeleted) {
      socket.disconnect();
      socket.connect();
      goto("/");
    }

    if (events.roomCreated) {
      $user.gameid = events.roomCreated;

      //set the event to null
      events.roomCreated = null;
    }

    if (events.roomJoined) {
      playersReady = events.roomJoined.num;
      console.log(playersReady);
      players = events.roomJoined.users;

      //set the event to null
      events.roomJoined = null;
    }

    if (events.roomLeft) {
      playersReady = events.roomLeft.num;
      players = events.roomLeft.names;

      //set the event to null
      events.roomLeft = null;
    }

    if (events.gameStarted) {
      console.log("game started event recieved on front end");
      console.log(events.gameStarted);
      $user.quiz = events.gameStarted.quiz;
      $user.displayQuestion = events?.gameStarted?.options?.displayQuestion;
      $user.bgColor = events?.gameStarted?.options?.bgColor || -1; //default color
      $user.bgMusic = events?.gameStarted?.options?.bgMusic || -1; //default music

      console.log($user);

      events.gameStarted = null;
      goto("/gameSession_");
    }

    if (events.reconnect) {
      let data = events.reconnect;
      $user.quiz = data.quiz;
      $user.currentSession = SCREENS.GAME;
      $user.reconnected = true;

      $user.bgColor = data?.bgColor || -1; //default color
      $user.bgMusic = data?.bgMusic || -1; //default music

      //will use data.currentQuestion in the future

      socket.emit("reconnected", $user.gameid);
      goto("/gameSession_");
    }

    if (events.lateConnect) {
      console.log(events.lateConnect);
      $user.quiz = events.lateConnect.data.quiz;
      console.log($user.quiz);
      $user.displayQuestion = events?.lateConnect?.options?.displayQuestion;
      $user.currentSession = SCREENS.GAME;
      $user.lateConnected = true;

      $user.bgColor = data?.bgColor || -1; //default color
      $user.bgMusic = data?.bgMusic || -1; //default music

      socket.emit("late-connected", $user.gameid);

      events.gameStarted = null;

      goto("/gameSession_");
    }
  }
</script>

<!-- <main>
  <body
    class="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 font-garamond"
  >
    <div class="container flex justify-center items-center">
      <h1 class="text-white text-3xl font-bold mb-8">Loading...</h1>

      <div
        id="inside-box"
        class="w-80 bg-purple-800 rounded-lg p-4 flex flex-col justify-between"
      >
        <div class="player-div bg-purple-600 rounded-lg p-4 mb-4">
          <div>
            <p id="players-ready" class="text-white text-sm font-semibold">
              Players Ready
            </p>
            <p id="player-number" class="text-white">{playersReady}</p>
          </div>
        </div>
        {#if $user.isHost}
          <div class="player-div bg-purple-600 rounded-lg p-4 mb-4">
            <div>
              <p id="host-id" class="text-white text-sm font-semibold">
                Host ID
              </p>
              <p id="game-id" class="text-white">{$user.gameid}</p>
            </div>
          </div>
        {/if}

        {#if players.length > 0}
          <div
            class="player-list bg-purple-600 rounded-lg p-4 mb-4 flex flex-wrap justify-center"
          >
            {#each players as { name, avatarIndex }}
              <div class="player-item mx-2 mb-2">
                <p class="player-name text-white">{name}</p>
                <img
                  class="player-avatar w-12 h-12 rounded-full"
                  src={`/avatars/${AVATARS[avatarIndex]}`}
                  alt="Avatar"
                />
              </div>
            {/each}
          </div>
        {/if}

         Force start the quiz atleast one player has joined -->
<!-- <div>
          {#if $user.isHost && playersReady >= 1}
            <button
              class="w-full bg-purple-600 text-white font-bold py-2 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              on:click={() => {
                socket.emit("force-start-game", $user.gameid);
              }}>Start Quiz</button
            >
          {/if}
        </div>

        Go back to menu, disconnect-->
<!-- <div>
          <button
            class="w-full bg-gray-500 text-white font-bold py-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
            id="createQuiz"
            on:click={() => {
              socket.disconnect();
              socket.connect();
              goto("/");
            }}>Leave room</button
          >
        </div>
      </div>
    </div> -->
<!-- </body> -->
<!-- </main> -->

<main class="flex justify-center items-center min-h-screen bg-purple-500">
  <div class="w-full max-w-md p-4 bg-purple-800 rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-white text-center mb-8">Loading...</h1>
    <div class="space-y-4">
      <div class="bg-purple-600 rounded-lg p-4 text-center">
        <p class="text-sm font-semibold text-white">Players Ready</p>
        <p class="text-white">{playersReady}</p>
      </div>
      {#if $user.isHost}
        <div class="bg-purple-600 rounded-lg p-4 text-center">
          <p class="text-sm font-semibold text-white">Host ID</p>
          <p class="text-white">{$user.gameid}</p>
        </div>
      {/if}

      <!-- Players list here -->
      {#if players.length > 0}
        <div
          class="player-list bg-purple-600 rounded-lg p-4 mb-4 flex flex-wrap justify-center"
        >
          {#each players as { name, avatarIndex }}
            <div class="player-item mx-2 mb-2">
              <p class="player-name text-white">{name}</p>
              <img
                class="player-avatar w-12 h-12 rounded-full"
                src={`/avatars/${AVATARS[avatarIndex]}`}
                alt="Avatar"
              />
            </div>
          {/each}
        </div>
      {/if}

      {#if $user.isHost && playersReady >= 1}
        <button
          class="w-full bg-purple-600 text-white font-bold py-2 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
          on:click={() => {
            socket.emit("force-start-game", $user.gameid);
          }}>Start Quiz</button
        >
      {/if}
      <button
        class="w-full bg-gray-500 text-white font-bold py-2 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
        on:click={() => {
          socket.disconnect();
          socket.connect();
          goto("/");
        }}
        >Leave room
      </button>
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .player-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .player-item {
    text-align: center;
    margin: 0 0.5rem;
  }
  /* Styles for small screens (phones) */
  @media screen and (max-width: 768px) {
    .player-list {
      flex-direction: column; /* Grow players vertically */
      align-items: center;
    }
  }

  /* Styles for large screens (desktops) */
  @media screen and (min-width: 769px) {
    .player-list {
      flex-direction: row; /* Grow players horizontally */
    }
  }
</style>
