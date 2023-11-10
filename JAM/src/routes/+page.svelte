<script lang="js">
  // @ts-nocheck

  import { io } from "socket.io-client";
  import { socket, socketEvents } from "$lib/socketStore.js";
  import { user } from "$lib/userStore.js";
  import { quiz3 } from "$lib/dummyQuiz.js";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";

  let roomid;
  let isRoomFull = false;

  let maxPlayers;

  let _userName;

  $: {
    const events = $socketEvents;
    console.log(events);

    if (events.roomCreated) {
      $user.gameid = events.roomCreated;
    }

    if (events.roomFull) {
      //alert
      alert("room full");
      isRoomFull = true;
      roomid = "";
    }
  }

  onMount(() => {
    $user.id = socket.id;
    maxPlayers = 2;
    _userName = $user.userName;
  });

  const createRoom = (soc, maxPlayers) => {
    if (maxPlayers < 2 || maxPlayers > 10) {
      alert("max players must be between 2 and 10");
      maxPlayers = 2;
      return;
    }

    soc.emit("create-room", $user.hostQuiz, maxPlayers);
    console.log("createRoom");
    $user.isHost = true;

    goto("/waitLobby");
  };

  const joinRoom = (soc, roomid, username) => {
    if (roomid) {
      soc.emit("join-room", roomid, username);
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

<!-- check if socket is connected -->

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
            <h2>Number of participants:</h2>
            <input
              type="number"
              class="form-control"
              id="participants"
              placeholder="Enter total number of participants"
              bind:value={maxPlayers}
            />
          </div>
          <p>
            <button
              type="button"
              class="btn btn-secondary btn-block"
              id="createRoom"
              on:click={() => createRoom(socket, maxPlayers)}
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
            placeholder="Enter roomID"
            {roomid}
          />
          <input
            type="text"
            class="form-control"
            placeholder="Enter username"
            id="username"
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
    color: black;
    font-family: JejuGothic, sans-serif;
    border-radius: 12px;
    height: 4rem;
    font-size: 20px;
  }
  .btn:active {
    background-color: #7801a8;
    color: #f0e9e9;
  }
  .btn-secondary {
    background: #f0e9e9;
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
    background: #f0e9e9;
    color: black;
    font-size: 20px;
    font-family: JejuGothic;
    font-weight: 400;
  }
</style>
