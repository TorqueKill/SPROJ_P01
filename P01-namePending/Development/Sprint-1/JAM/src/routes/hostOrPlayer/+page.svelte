<script lang="js">
  // @ts-nocheck

  import { io } from "socket.io-client";
  import { socket, roomEvents } from "$lib/socketStore.js";
  import { ROOM_SETTINGS } from "$lib/config"
  import { user } from "$lib/userStore.js";
  import { quiz3 } from "$lib/dummyQuiz.js";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";

  const MIN_PLAYERS = ROOM_SETTINGS.MIN_PLAYERS;
  const MAX_PLAYERS = ROOM_SETTINGS.MAX_PLAYERS
  const MAX_REPORT_SCORES = ROOM_SETTINGS.MAX_QUESTIONS_PER_REPORT

  let roomid;
  let isRoomFull = false;

  let maxPlayers;
  let roomSettings = {
    maxPlayers: MIN_PLAYERS,
    reportScores: -1, //means report scores at the end
  };

  let _userName;


  onMount(() => {
    $user.id = socket.id;
    maxPlayers = 2;
    _userName = $user.userName;

    console.log($user);
  });

  //----------------------------REACTIVE CHANGES-------------------------

  $: {
    const events = $roomEvents;
    console.log(events);

    if (events.roomCreated) {
      $user.gameid = events.roomCreated;

      events.roomCreated = null
    }

    if (events.roomFull) {
      //alert
      alert("Room Full");
      isRoomFull = true;
      roomid = "";

      events.roomFull = null
    }
  }

  //-------------------------------FUNCTIONS---------------------------------

  const createRoom = (soc, roomsettings) => {
    if (roomsettings.maxPlayers < MIN_PLAYERS || roomsettings.maxPlayers > MAX_PLAYERS) {
      alert("max players must be between 2 and 10");
      maxPlayers = MIN_PLAYERS;
      return;
    }

    if (roomsettings.reportScores < -1 || roomsettings.reportScores > MAX_REPORT_SCORES) {
      alert("report scores must be between -1 and 5");
      roomsettings.reportScores = -1;
      return;
    }

    let userData = {
        username: $user.userName,
        email: $user.email,
    };

    soc.emit("create-room", $user.hostQuiz, roomSettings, userData);
    console.log("createRoom", roomSettings);
    $user.isHost = true;

    goto("/waitLobby");
  };

  const joinRoom = (soc, roomid, username) => {
    if (roomid) {

      let userData = {
        username: username,
        email: $user.email,
      };

      if ($user.email != "") {
        soc.emit("join-room", roomid, userData);
      } else {
        soc.emit("join-room", roomid, userData);
      }

      console.log("joinRoom");

      if (!isRoomFull) {
        $user.gameid = roomid;
        goto("/waitLobby");
      }
    } else {
      alert("please enter a room id");
    }
  };

  const setUserName = (userName) => {
    if (userName) {
      $user.userName = userName;
    } else {
      alert("please enter a username");
    }
  };
</script>


<main>
  <body>
    <h1 id="home">JAM</h1>
    <div class="container mb-4">
      <div
        class="container mt-4 mb-5 d-flex justify-content-center"
        id="inside-box"
      >
        <!--ask if host or player-->
        <!--if host, show create room button else show joing room-->
        {#if !$user.userDecided}
          <p>
            <button
              type="button"
              class="btn btn-primary btn-block"
              id="hostQuiz"
              on:click={() => {
                $user.isHost = true;
                $user.userDecided = true;
              }}>Host</button
            >
          </p>
          <p>
            <button
              type="button"
              class="btn btn-secondary btn-block"
              id="hostQuiz"
              on:click={() => {
                $user.userDecided = true;
              }}>Join</button
            >
          </p>
        {:else if $user.isHost}
          <div>
            <h2>Number of participants</h2>
            <input
              type="number"
              class="form-control"
              id="participants"
              placeholder="Enter total number of participants"
              bind:value={roomSettings.maxPlayers}
            />
          </div>
          <div>
            <h2>Report scores in between</h2>
            <input
              type="number"
              class="form-control"
              id="participants"
              placeholder="Enter total number of participants"
              bind:value={roomSettings.reportScores}
            />
            <p>(-1 will report at the end)</p>
          </div>
          <p>
            <button
              type="button"
              class="btn btn-secondary btn-block"
              id="createRoom"
              on:click={() => createRoom(socket, roomSettings)}
              >Create Room</button
            >
          </p>
          <p>
            <button
              type="button"
              class="btn btn-secondary btn-block"
              id="createQuiz"
              on:click={() => {
                goto("/createQuiz");
              }}>Create Quiz</button
            >
          </p>
        {:else}
          <h2 id="setUser">Enter roomID and username</h2>
          <input
            type="text"
            class="form-control"
            id="roomId"
            placeholder="Enter room ID"
            bind:value={roomid}
          />
          <input
            type="text"
            class="form-control"
            id="username"
            placeholder="Enter username"
            bind:value={_userName}
          />
          <button
            class="btn btn-tertiary btn-block"
            id="setUsername"
            on:click={() => {
              setUserName(_userName);
            }}>Save username</button
          >
          <button
            class="btn btn-tertiary btn-block"
            id="createRoom"
            on:click={() => joinRoom(socket, roomid, $user.userName)}
            >Join Room</button
          >
        {/if}
      </div>
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

  #inside-box {
    width: 25rem;
    height: 25rem;
    background: #c49eff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 51px;
    padding-top: 6rem;
  }
  .container {
    margin-top: 4rem;
    margin-left: 16rem;
  }
  .btn {
    margin-top: 3rem;
    margin-left: 7.5rem;
    margin-right: 6rem;
    width: 10rem;
    background: #f0e9e9;
    border: None;
    color: white;
    font-family: JejuGothic, sans-serif;
    border-radius: 12px;
    height: 3.5rem;
    font-size: 20px;
  }
  .btn:active {
    background-color: #7801a8;
    color: #f0e9e9;
  }
  .btn-secondary {
    background: #00a59b;
    border: None;
    margin-top: 1rem;
    margin-left: 7.5rem;
    font-size: 20px;
  }
  #participants {
    border: None;
    padding: 0.75rem;
    background-color: #f0e9e9;
    margin-bottom: 2rem;
    border-radius: 12px;
    margin-left: 7rem;
    margin-top: 1rem;
  }
  h2 {
    font-family: JejuGothic, sans-serif;
    font-size: 15px;
    margin-left: 6.65rem;
    margin-top: -1rem;
  }
  #username {
    border: None;
    padding: 0.75rem;
    background-color: #f0e9e9;
    margin-bottom: 2rem;
    border-radius: 12px;
    margin-left: 7rem;
    margin-top: -2rem;
  }
  #roomId {
    border: None;
    padding: 0.75rem;
    background-color: #f0e9e9;
    margin-bottom: 2rem;
    border-radius: 12px;
    margin-left: 7rem;
    margin-top: 1rem;
  }
  #setUsername {
    background: #00a59b;
    color: white;
    font-size: 20px;
    font-family: JejuGothic;
    font-weight: 400;
  }
  #setUsername:active {
    background: #02625c;
  }
  #setUser {
    font-family: JejuGothic, sans-serif;
    font-size: 20px;
    margin-left: 4.5rem;
    margin-top: -1rem;
  }
  .btn-tertiary {
    margin-top: 0.75rem;
    width: 10rem;
    height: 3rem;
    background: #00a59b;
    color: white;
    font-size: 20px;
    font-family: JejuGothic;
    font-weight: 400;
  }
  .btn-primary {
    background: #00a59b;
  }
</style>
