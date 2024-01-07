<script lang="js">
  // @ts-nocheck

  import { socket, roomEvents } from "$lib/socketStore.js";
  import { ROOM_SETTINGS } from "$lib/config"
  import { user } from "$lib/userStore.js";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";

  const MIN_PLAYERS = ROOM_SETTINGS.MIN_PLAYERS;
  const MAX_PLAYERS = ROOM_SETTINGS.MAX_PLAYERS;
  const MAX_REPORT_SCORES = ROOM_SETTINGS.MAX_QUESTIONS_PER_REPORT;

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

      events.roomCreated = null;
    }

    if (events.roomFull) {
      //alert
      alert("Room Full");
      isRoomFull = true;
      roomid = "";

      events.roomFull = null;
    }
  }

  //-------------------------------FUNCTIONS---------------------------------

  const createRoom = (soc, roomsettings) => {
    if (
      roomsettings.maxPlayers < MIN_PLAYERS ||
      roomsettings.maxPlayers > MAX_PLAYERS
    ) {
      alert("max players must be between 2 and 10");
      maxPlayers = MIN_PLAYERS;
      return;
    }

    if (
      roomsettings.reportScores < -1 ||
      roomsettings.reportScores > MAX_REPORT_SCORES
    ) {
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
    <div class="container">
      <div>
        <!--ask if host or player-->
        <!--if host, show create room button else show joing room-->
        {#if !$user.userDecided}
          <p>
            <button
              type="button"
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
              id="participants"
              placeholder="Enter total number of participants"
              bind:value={roomSettings.reportScores}
            />
            <p id="report">-1: Report at the end</p>
          </div>
          <button
            type = "button"
              on:click={() => {
              //check if user has an email
              if ($user.email == "") {
                alert("must be logged in");
              }else{
                goto("/viewHistory");
              }
              }}>View History</button>
          <p>
            <button
              type="button"
              on:click={() => createRoom(socket, roomSettings)}
              >Create Room</button
            >
          </p>
          <p>
            <button
              type="button"
              on:click={() => {
                goto("/createQuiz");
              }}>Create Quiz</button
            >
          </p>

          <p></p>
          <button
            type="button"
            on:click={() => {
              $user.isHost = false;
              $user.userDecided = false;
            }}>Go Back</button>
        {:else}
          <h2>Enter roomID and username</h2>
          <input
            type="text"
            class="form"
            id="roomId"
            placeholder="Enter room ID"
            bind:value={roomid}
          />
          <input
            type="text"
            class="form"
            id="roomId"
            placeholder="Enter username"
            bind:value={_userName}
          />
          <p></p>
          <button
          type = "button"
            on:click={() => {
              setUserName(_userName);
            }}>Save username</button
          >
          <p></p>
          <button
          type = "button"
            on:click={() => {
            //check if user has an email
            if ($user.email == "") {
              alert("must be logged in");
            }else{
              goto("/viewHistory");
            }
            }}>View History</button
          >
          <p></p>
          <button
            type="button"
            on:click={() => joinRoom(socket, roomid, $user.userName)}
            >Join Room</button
          >
          <p></p>
          <button
            type="button"
            on:click={() => {
              $user.isHost = false;
              $user.userDecided = false;
            }}>Go Back</button>
        {/if}
      </div>
    </div>
  </body>
</main>

<style>
  body {
    padding: 0;
    height: 100%;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #7801a8;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    border-radius: 15px;
    background-color: #018198;
    color: #c49eff;
    border: none;
    margin-top: 15rem;
  }

  button {
    background-color: #ccc;
    border: none;
    color: white;
    padding: 5px 25px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 25px;
    margin: 4px 140px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease;
    font-family: JejuGothic, sans-serif;
  }
  button:hover {
    background-color: #c49eff;
  }

  #report {
    color: rgb(194, 12, 12);
    text-align: center;
    margin-top: -1rem;
  }

  input {
    width: 30%;
    padding: 10px;
    margin-bottom: 1rem;
    font-family: JejuGothic, sans-serif;
    font-size: 18px;
    border-radius: 4px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
  }

  #participants {
    border: None;
    padding: 0.75rem;
    background-color: #f0e9e9;
    margin-bottom: 2rem;
    border-radius: 12px;
    text-align: center;
    margin-left: 8rem;
  }
  h2 {
    font-family: JejuGothic, sans-serif;
    font-size: 15px;
    text-align: center;
  }

  #roomId {
    border: None;
    padding: 0.75rem;
    background-color: #f0e9e9;
    margin-bottom: 2rem;
    border-radius: 12px;
    margin-left: 8rem;
  }
  .form {
    text-align: center;
    margin-left: 21rem;
    margin-top: 2rem;
  }

  #hostQuiz {
    font-size: 28px;
    text-align: center;
    width: 30%;
  }

  @media (max-width: 768px) {
    input,
    button {
      padding: 10px;
      font-size: 14px;
      border-radius: 10px;
    }
  }

  @media (min-width: 769px) {
    button {
      padding: 10px 25px;
      font-size: 18px;
      border-radius: 20px;
    }
  }
</style>
