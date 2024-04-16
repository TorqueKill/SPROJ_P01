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
</script>


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
          on:click={() => goto("/viewHistNew")}
        >
          History
        </button>
      </li>

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
        <div
          class="w-full p-4 md:max-w-md lg:max-w-lg bg-black bg-opacity-80 rounded-lg shadow-2xl space-y-4"
        >
          <button
            class="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
            on:click={() => goto("/CreateQuestion")}
          >
            Create Quiz
          </button>
          <button
            class="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
            on:click={() => goto("/chooseQuiz_")}
          >
            Choose Quiz
          </button>
          <button
            class="w-full px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
            on:click={() => {
              $user.isHost = false;
              $user.userDecided = false;
            }}
          >
            Go Back
          </button>
        </div>
      </div>

    {:else}
      <div
        class="flex flex-col items-center p-8 bg-black bg-opacity-80 rounded-lg shadow-2xl"
      >
        <h2 class="text-2xl font-bold text-white mb-4">
          Enter Room ID and Username
        </h2>
        <div class="w-full max-w-xs space-y-4">
          <input
            type="text"
            class="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border rounded-full shadow appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
            id="roomId"
            placeholder="Enter room ID"
            bind:value={roomid}
          />
          <input
            type="text"
            class="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border rounded-full shadow appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
            id="username"
            placeholder="Enter username"
            bind:value={_userName}
          />
          {#if $user.avatarIndex !== null}
            <div class="flex justify-center">
              <img
                class="w-24 h-24 rounded-full"
                src={`/avatars/${AVATARS[$user.avatarIndex]}`}
                alt="Avatar"
              />
            </div>
          {/if}
          <button
            class="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
            on:click={() => setUserName(_userName)}
          >
            Save username
          </button>
          <button
            class="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
            on:click={openModal}
          >
            Choose avatar
          </button>
          <button
            class="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
            on:click={() => joinRoom(socket, roomid, $user.userName)}
          >
            Join Room
          </button>
          <button
            class="w-full px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
            on:click={() => {
              $user.isHost = false;
              $user.userDecided = false;
            }}
          >
            Go Back
          </button>
        </div>

        {#if showModal}
          <div
            class="fixed inset-0 bg-purple-900 bg-opacity-90 px-4 py-20 flex items-center justify-center z-50"
          >
            <div
              class="bg-black bg-opacity-80 shadow-2xl rounded-lg max-w-lg mx-auto p-6 md:max-w-2xl"
            >
              <h2 class="text-2xl text-white font-bold mb-4">
                Choose your avatar
              </h2>
              <div class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
                {#each AVATARS as avatar, index}
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <img
                    class="w-full h-auto rounded-full cursor-pointer hover:opacity-50 transition-opacity"
                    src={`/avatars/${avatar}`}
                    alt={`Avatar ${index}`}
                    on:click={() => handleAvatarSelection(index)}
                  />
                {/each}
              </div>
              <div class="mt-4">
                <button
                  class="w-full px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 shadow-lg"
                  on:click={closeModal}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
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
            <button type="button" on:click={closeHostSettingsModal}
              >Save Settings</button
            >
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>


