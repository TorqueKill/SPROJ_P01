<script lang="js">
  // @ts-nocheck

  import { socket, roomEvents } from "$lib/socketStore.js";
  import { ROOM_SETTINGS } from "$lib/config";
  import { SCREENS, AVATARS } from "$lib/config.js";
  import { user } from "$lib/userStore.js";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";

  import AvatarMenu from "../../lib/avatarMenu/+page.svelte";

  const MIN_PLAYERS = ROOM_SETTINGS.MIN_PLAYERS;
  const MAX_PLAYERS = ROOM_SETTINGS.MAX_PLAYERS;
  const MAX_REPORT_SCORES = ROOM_SETTINGS.MAX_QUESTIONS_PER_REPORT;

  let roomid;
  let isRoomFull = false;

  let maxPlayers;
  let roomSettings = {
    maxPlayers: MIN_PLAYERS,
    reportScores: 1, //means report scores after each question
    displayQuestion: false,
  };

  let _userName;

  let selectedAvatarIndex = null;
  let showModal = false;
  let showHostSettingsModal = false;

  const openHostSettingsModal = () => {
    showHostSettingsModal = true;
  };

  const closeHostSettingsModal = () => {
    showHostSettingsModal = false;
  };

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

  const logout = async () => {
    try {
      // Call the logout method from your authentication service
      //await authService.logout();

      // Redirect to the login page or any other desired page after logout
      goto("/signIn");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
      roomsettings.reportScores = 1;
      return;
    }

    let userData = {
      username: $user.userName,
      email: $user.email,
    };

    console.log(roomSettings);

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
        avatarIndex: $user.avatarIndex,
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
      alert("Username Saved Successfully.");
    } else {
      alert("please enter a username");
    }
  };

  const handleAvatarSelection = (index) => {
    selectedAvatarIndex = index;
    $user.avatarIndex = index;
    console.log(`index of selected avatar: ${index + 1}`);
    closeModal();
  };

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function handleHost() {
    user.isHost = true;
    user.userDecided = true;
    goto("/CreateQuestion");
    // Your logic to handle 'createRoom' if needed
  }

  function handleJoin() {
    user.userDecided = true;
    joinRoom(socket, roomid, user.userName);
  }
</script>

<!-- As a heading -->
<!-- <nav>
  <div class="logo">JAM</div>
  <ul>
    <li><button class="nav_button" on:click={() => goto("/")}>Home</button></li>
    <li>
      <button class="nav_button" on:click={() => goto("/viewHistory")}
        >History</button
      >
    </li>
    {#if $user.isHost}
       Show Host Settings button only if the user is a host -->
<!-- <li>
        <button class="nav_button" on:click={openHostSettingsModal}
          >Host Settings</button
        >
      </li>
    {/if}
    <li><button class="nav_button" on:click={logout}>Logout</button></li>
  </ul>
</nav> -->

<!-- <nav class="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 p-2 fixed top-0 w-full z-10 flex justify-between items-center">
  <div class="text-xl font-bold text-white ml-4">JAM</div>
  <ul class="flex list-none m-0 p-0 items-center">
    <li><button class="text-white py-2 px-4 hover:bg-purple-600 transition-colors" on:click={() => goto("/")}>Home</button></li>
    <li>
    <button class="text-white py-2 px-4 hover:bg-purple-600 transition-colors" on:click={() => goto("/viewHistory")}
      >History</button
    >
  </li>
  {#if $user.isHost}
     Show Host Settings button only if the user is a host -->
<!-- <li>
      <button class="text-white py-2 px-4 hover:bg-purple-600 transition-colors" on:click={openHostSettingsModal}
        >Host Settings</button
      >
    </li>
  {/if}
  <li><button class="text-white py-2 px-4 hover:bg-purple-600 transition-colors" on:click={logout}>Logout</button></li>
  </ul>
</nav> -->

<!-- <main>
  <body>
    <div class="container">
      <div>
        <ask if host or player-->
<!--if host, show create room button else show joing room-->
<!-- {#if !$user.userDecided}
          <p>
            <button
              type="button"
              id="hostQuiz"
              class="btn btn-tertiary btn-block"
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
              class="btn btn-tertiary btn-block"
              on:click={() => {
                $user.userDecided = true;
                closeHostSettingsModal();
              }}>Join</button
            >
          </p>
        {:else if $user.isHost}
          <div>
            <p>
              <button
                type="button"
                class="btn btn-tertiary btn-block"
                on:click={() => {
                  goto("/CreateQuestion");
                }}>Create Quiz</button
              >
            </p>

            <p>
              <button
                type="button"
                class="btn btn-tertiary btn-block"
                on:click={() => {
                  goto("/chooseQuiz_");
                }}>Choose Quiz</button
              >
            </p>
          </div> -->
<!-- <p>
            <button
              type="button"
              on:click={() => createRoom(socket, roomSettings)}
              >Create Room</button
            >
          </p>

          <h2>Number of participants</h2>
          <input
            type="number"
            class="form-control"
            id="participants"
            placeholder="Total participants"
            bind:value={roomSettings.maxPlayers}
          /> -->

<!-- <p />
          <button
            type="button"
            class="btn btn-secondary btn-block"
            on:click={() => {
              $user.isHost = false;
              $user.userDecided = false;
            }}>Go Back</button
          >
        {:else}
          <h2>Enter roomID and username</h2>
          <div class="user-input-container">
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
            {#if $user.avatarIndex !== null}
              <div class="avatar-container">
                <img
                  class="player-avatar"
                  src={`/avatars/${AVATARS[$user.avatarIndex]}`}
                  alt="Avatar"
                />
              </div>
            {/if}
          </div>
          <p />
          <button
            type="button"
            class="btn btn-tertiary btn-block"
            on:click={() => {
              setUserName(_userName);
            }}>Save username</button
          >
          <p />
          <button
            type="button"
            class="btn btn-tertiary btn-block"
            on:click={() => {
              openModal();
            }}>Choose avatar</button
          >
          {#if showModal}
            <div class="modal-overlay">
              <div class="modal-content">
                <button
                  on:click={closeModal}
                  class="btn btn-secondary btn-block modal-button"
                  >Go Back</button
                >
                <AvatarMenu selectAvatar={handleAvatarSelection} />
              </div>
            </div>
          {/if}
          <p />
          <p />
          <button
            type="button"
            class="btn btn-tertiary btn-block"
            on:click={() => joinRoom(socket, roomid, $user.userName)}
            >Join Room</button
          >
          <p />
          <button
            type="button"
            class="btn btn-secondary btn-block"
            on:click={() => {
              $user.isHost = false;
              $user.userDecided = false;
            }}>Go Back</button
          >
        {/if}

        {#if showHostSettingsModal}
          <div class="modal-overlay">
            <div class="modal-content">
              <button
                on:click={closeHostSettingsModal}
                class="modal-button"
                style="margin-left: -3%; margin-top: -3%;">Go Back</button
              >
              <h2 style="font-size: 28px;">Host Settings</h2>
              <div style="background: #690092;">
                <div>
                  <h3>Report scores in between</h3>
                  <input
                    type="number"
                    id="participants"
                    placeholder="Enter total number of participants"
                    bind:value={roomSettings.reportScores}
                  />
                  <p id="report">-1: Report at the end</p>
                </div>
                <div>
                  <h3>Display question on Players</h3>
                  <input
                    type="checkbox"
                    id="participants"
                    placeholder="Enter total number of participants"
                    bind:checked={roomSettings.displayQuestion}
                  />
                </div>
              </div>
              <button type="button" on:click={closeHostSettingsModal}
                >Save Settings</button
              >
            </div>
          </div>
        {/if}
      </div>
    </div>
  </body>
</main>

<style>
  nav {
    background-color: #690092; /* Purple background color */
    padding: 0.5rem 1rem; /* Padding around the navbar */
    position: fixed; /* Fix the position at the top */
    width: 100%; /* Full width */
    top: 0; /* Position at the top of the page */
    z-index: 1000; /* Stack above other content */
    display: flex; /* Use flexbox for positioning */
    justify-content: space-between; /* Space between items */
    align-items: center; /* Center items vertically */
  }

  ul {
    list-style: none; /* Remove list styling */
    display: flex; /* Display as flex for inline positioning */
    margin: 0;
    padding: 0;
    align-items: center; /* Center items vertically */
  }

  .logo {
    flex-grow: 1; /* Allows the logo to grow and push the nav buttons to the right */
    color: #c49eff; /* Logo text color */
    font-size: 1.5rem; /* Logo text size */
    font-weight: bold;
    margin-left: 2rem;
  }

  .nav_button {
    background-color: transparent; /* Transparent button background */
    color: #c49eff; /* Button text color */
    padding: 0.5rem 1rem; /* Padding inside buttons */
    border: none; /* No border for buttons */
    text-align: center; /* Center the text inside buttons */
    text-decoration: none; /* No underline */
    font-size: 1rem; /* Button text size */
    cursor: pointer; /* Pointer cursor on hover */
    border-radius: 0.25rem; /* Slightly rounded corners for buttons */
    transition: color 0.3s ease, background-color 0.3s ease; /* Transition effect for hover */
  }

  .nav_button:hover {
    background-color: #c49eff; /* Button background color on hover */
    color: #690092; /* Button text color on hover */
  }

  /* Adjustments for mobile screens */
  @media (max-width: 768px) {
    .nav_button {
      padding: 0.5rem; /* Smaller padding on mobile */
      font-size: 0.875rem; /* Smaller text on mobile */
    }
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

  .btn-tertiary,
  .btn-secondary {
    background: #ccc;
    color: #8f00c7;
  }

  .btn-tertiary:hover {
    background: #8f00c7;
    color: #ccc;
  }

  .btn-secondary:hover {
    background: #c70000;
    color: #ccc;
  }

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

  .modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
  }

  .player-avatar {
    width: 50px;
    height: 50px;
    margin-top: -115px;
    border-radius: 50%; /* Optional: makes the avatar circular */
  }
  .avatar-container {
    display: flex;
    align-items: center;
    margin-left: 300px;
  }

  .player-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .player-name {
    margin: 0;
    color: white;
  }

  .modal-content {
    background-color: #8f00c7;
    padding: 20px;
    border-radius: 10px;
  }

  .modal-button {
    background-color: #c49eff;
    color: white;
    display: flex;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    input,
    button {
      padding: 10px;
      font-size: 14px;
      border-radius: 10px;
    }
    .nav_button {
      margin: 4px 20px; /* Adjusted margin for larger screens */
    }
  }

  @media (min-width: 769px) {
    button {
      padding: 10px 25px;
      font-size: 18px;
      border-radius: 20px;
    }
    .nav_button {
      margin: 4px 20px; /* Adjusted margin for larger screens */
    }
  }
</style> -->

<nav
  class="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 p-4 fixed top-0 w-full z-50 shadow-lg font-garamond"
>
  <div class="container mx-auto flex justify-between items-center">
    <div class="text-2xl font-bold text-white">JAM</div>
    <ul class="flex space-x-4">
      <li>
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          on:click={() => goto("/")}
        >
          Home
        </button>
      </li>
      <li>
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          on:click={() => goto("/viewHistory")}
        >
          History
        </button>
      </li>
      {#if $user.isHost}
        <li>
          <button
            class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            on:click={openHostSettingsModal}>Host Settings</button
          >
        </li>
      {/if}
      <li>
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          on:click={logout}
        >
          Logout
        </button>
      </li>
    </ul>
  </div>
</nav>

<main
  class="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 font-garamond"
>
  <div
    class="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl text-center max-w-2xl mx-auto"
  >
    {#if !$user.userDecided}
      <h1
        class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300"
      >
        Host or Play
      </h1>
      <p class="mb-6 text-lg font-medium text-gray-300">
        Are you ready to host or join a quiz battle? Choose your role.
      </p>
      <div class="flex gap-4 justify-center">
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          on:click={() => {
            $user.isHost = true;
            $user.userDecided = true;
          }}>Host</button
        >
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          on:click={() => {
            $user.userDecided = true;
            closeHostSettingsModal();
          }}>Join</button
        >
      </div>
    {:else if $user.isHost}
      <div>
        <p>
          <button
            type="button"
            class="btn btn-tertiary btn-block"
            on:click={() => {
              goto("/CreateQuestion");
            }}>Create Quiz</button
          >
        </p>

        <p>
          <button
            type="button"
            class="btn btn-tertiary btn-block"
            on:click={() => {
              goto("/chooseQuiz_");
            }}>Choose Quiz</button
          >
        </p>
      </div>
      <p>
        <button type="button" on:click={() => createRoom(socket, roomSettings)}
          >Create Room</button
        >
      </p>

      <h2>Number of participants</h2>
      <input
        type="number"
        class="form-control"
        id="participants"
        placeholder="Total participants"
        bind:value={roomSettings.maxPlayers}
      />

      <p />
      <button
        type="button"
        class="btn btn-secondary btn-block"
        on:click={() => {
          $user.isHost = false;
          $user.userDecided = false;
        }}>Go Back</button
      >
    {:else}
      <h2>Enter roomID and username</h2>
      <div class="user-input-container">
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
        {#if $user.avatarIndex !== null}
          <div class="avatar-container">
            <img
              class="player-avatar"
              src={`/avatars/${AVATARS[$user.avatarIndex]}`}
              alt="Avatar"
            />
          </div>
        {/if}
      </div>
      <p />
      <button
        type="button"
        class="btn btn-tertiary btn-block"
        on:click={() => {
          setUserName(_userName);
        }}>Save username</button
      >
      <p />
      <button
        type="button"
        class="btn btn-tertiary btn-block"
        on:click={() => {
          openModal();
        }}>Choose avatar</button
      >

      {#if showModal}
        <div class="modal-overlay">
          <div class="modal-content">
            <button
              on:click={closeModal}
              class="btn btn-secondary btn-block modal-button">Go Back</button
            >
            <AvatarMenu selectAvatar={handleAvatarSelection} />
          </div>
        </div>
      {/if}
      <p />
      <p />
      <button
        type="button"
        class="btn btn-tertiary btn-block"
        on:click={() => joinRoom(socket, roomid, $user.userName)}
        >Join Room</button
      >
      <p />
      <button
        type="button"
        class="btn btn-secondary btn-block"
        on:click={() => {
          $user.isHost = false;
          $user.userDecided = false;
        }}>Go Back</button
      >
    {/if}

    {#if showHostSettingsModal}
      <div class="modal-overlay">
        <div class="modal-content">
          <button
            on:click={closeHostSettingsModal}
            class="modal-button"
            style="margin-left: -3%; margin-top: -3%;">Go Back</button
          >
          <h2 style="font-size: 28px;">Host Settings</h2>
          <div style="background: #690092;">
            <div>
              <h3>Report scores in between</h3>
              <input
                type="number"
                id="participants"
                placeholder="Enter total number of participants"
                bind:value={roomSettings.reportScores}
              />
              <p id="report">-1: Report at the end</p>
            </div>
            <div>
              <h3>Display question on Players</h3>
              <input
                type="checkbox"
                id="participants"
                placeholder="Enter total number of participants"
                bind:checked={roomSettings.displayQuestion}
              />
            </div>
          </div>
          <button type="button" on:click={closeHostSettingsModal}
            >Save Settings</button
          >
        </div>
      </div>
    {/if}
  </div>
</main>
