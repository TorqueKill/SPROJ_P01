<script>
  // @ts-nocheck
  import DmyGame from "$lib/dummyPages/dmyGame/+page.svelte";
  import { socket } from "$lib/socketStore.js";
  import { DEFAULT_ROOM_SETTINGS, ROOM_SETTINGS } from "$lib/config";
  import { user } from "$lib/userStore.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  const bgMusic = ROOM_SETTINGS.BG_MUSIC;
  const bgColors = ROOM_SETTINGS.BG_COLORS;

  const noMusicIcon =
    "https://www.svgrepo.com/show/95663/muted-music-notes.svg";

  let bgColorIdx = DEFAULT_ROOM_SETTINGS.DEFAULT_BG_COLOR_INDEX;
  let bgMusicIdx = DEFAULT_ROOM_SETTINGS.DEFAULT_BG_MUSIC_INDEX;
  let displayQuestionOnPlayer =
    DEFAULT_ROOM_SETTINGS.DEFAULT_QUESTION_ON_PLAYER_SCREEN;

  let roomSettings = {
    maxPlayers: ROOM_SETTINGS.MIN_PLAYERS,
    reportScores: DEFAULT_ROOM_SETTINGS.DEFAULT_QUESTION_PER_REPORT,
    bgColor: DEFAULT_ROOM_SETTINGS.DEFAULT_BG_COLOR,
    bgMusic: DEFAULT_ROOM_SETTINGS.DEFAULT_BG_MUSIC,
    displayQuestion: DEFAULT_ROOM_SETTINGS.DEFAULT_QUESTION_ON_PLAYER_SCREEN,
  };

  const showToggleQuestionDisplay = false;
  const maxQuestionsToReport = ROOM_SETTINGS.MAX_QUESTIONS_PER_REPORT; //dummy value for now

  let selectedBgColor = bgColors[bgColorIdx];
  let selectedBgMusic = bgMusic[bgMusicIdx];

  let showAdvancedSettings = false;
  let scoreDisplaySliderValue =
    DEFAULT_ROOM_SETTINGS.DEFAULT_QUESTION_PER_REPORT; // Slider value mapped to actual scoreDisplay

  function selectBgMusic(index) {
    bgMusicIdx = index;
    selectedBgMusic = bgMusic[bgMusicIdx];
  }

  function selectBgColor(index) {
    bgColorIdx = index;
    selectedBgColor = bgColors[bgColorIdx];
  }

  function toggleDisplayQuestionOnPlayer(e) {
    displayQuestionOnPlayer = e.target.checked;
  }

  function toggleAdvancedSettings() {
    showAdvancedSettings = !showAdvancedSettings;
  }

  $: selectedBgColor = bgColors[bgColorIdx];
  $: selectedBgMusic = bgMusic[bgMusicIdx];
  $: roomSettings.reportScores =
    scoreDisplaySliderValue === 0 ? -1 : scoreDisplaySliderValue;

  const createRoom = (soc, roomsettings) => {
    if (
      roomsettings.maxPlayers < ROOM_SETTINGS.MIN_PLAYERS ||
      roomsettings.maxPlayers > ROOM_SETTINGS.MAX_PLAYERS
    ) {
      alert("max players must be between 2 and 10");
      roomSettings.maxPlayers = ROOM_SETTINGS.MIN_PLAYERS;
      return;
    }

    if (
      roomsettings.reportScores < ROOM_SETTINGS.MIN_QUESTIONS_PER_REPORT ||
      roomsettings.reportScores > ROOM_SETTINGS.MAX_QUESTIONS_PER_REPORT
    ) {
      alert("report scores must be between 0 and 5");
      roomSettings.reportScores =
        DEFAULT_ROOM_SETTINGS.DEFAULT_QUESTION_ON_PLAYER_SCREEN;
      return;
    }

    let userData = {
      username: $user.userName,
      email: $user.email,
    };

    roomsettings.bgColor = selectedBgColor;
    roomsettings.bgMusic = selectedBgMusic;
    roomsettings.displayQuestion = displayQuestionOnPlayer;

    soc.emit("create-room", $user.hostQuiz, roomsettings, userData);
    console.log("createRoom", roomsettings);
    $user.isHost = true;

    goto("/waitLobby");
  };

  onMount(() => {
    $user.id = socket.id;

    console.log($user);
  });
</script>

<div class="flex flex-col md:flex-row min-h-screen">
  <!-- Container for user input box -->
  <!-- Full-width container for the main content -->
  <div
    class="md:w-1/3 min-h-screen bg-purple-900 text-white flex flex-col justify-center items-center gap-6 p-6"
  >
    <!-- Centered container for inputs and create room button -->
    <div
      class="flex flex-col justify-around items-center w-full max-w-md space-y-8"
    >
      <!-- Number of Participants -->
      <div class="flex flex-col items-center w-full">
        <label for="participants" class="text-lg font-medium"
          >Number of Participants:</label
        >
        <input
          type="number"
          id="participants"
          bind:value={roomSettings.maxPlayers}
          class="w-2/3 text-black text-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm"
          placeholder="Enter number of participants"
        />
      </div>

      <div class="w-full text-center my-4">
        <button
          class="text-lg text-white font-medium py-2 px-4 rounded-md bg-purple-700 hover:bg-purple-800"
          on:click={toggleAdvancedSettings}
        >
          {showAdvancedSettings
            ? "Hide Advanced Settings"
            : "Show Advanced Settings"}
        </button>
      </div>

      {#if showAdvancedSettings}
        <!-- Room Background Color Selector -->
        <div class="flex flex-col items-center w-full">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="text-lg font-medium">Room Background Color:</label>
          <div
            class="flex justify-center items-center gap-4 mt-2 w-2/3 space-x-6"
          >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            {#each bgColors as color, index}
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                on:click={() => selectBgColor(index)}
                class="cursor-pointer w-10 h-10 shadow-lg {bgColors[
                  index
                ]} {index === bgColorIdx ? 'ring-2 ring-purple-600' : ''}"
                title={color.name}
              />
            {/each}
          </div>
        </div>

        <!-- Background Music Selector -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="flex justify-center items-center gap-4 mt-2 w-full space-x-4"
        >
          {#each bgMusic.slice(0, bgMusic.length - 1) as music, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              on:click={() => selectBgMusic(index)}
              class="cursor-pointer font-bold text-lg p-2 bg-purple-700 rounded {index ===
              bgMusicIdx
                ? 'ring-2 ring-purple-600'
                : ''}"
            >
              {index + 1}
            </div>
          {/each}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            on:click={() => selectBgMusic(bgMusic.length - 1)}
            class="cursor-pointer font-bold text-lg p-2 bg-purple-700 rounded {bgMusicIdx ===
            bgMusic.length - 1
              ? 'ring-2 ring-purple-600'
              : ''}"
          >
            <img src={noMusicIcon} class="h-6 w-6" alt="No Music" />
          </div>
        </div>

        <!-- Score Display Frequency Slider -->
        <div class="flex flex-col items-center w-full">
          <label for="scoreDisplaySlider" class="text-lg font-medium"
            >Score Display Frequency:</label
          >
          <input
            type="range"
            id="scoreDisplaySlider"
            min="0"
            max={maxQuestionsToReport}
            bind:value={scoreDisplaySliderValue}
            class="w-2/3 mt-2"
          />
          <span class="text-sm">
            {roomSettings.reportScores === -1
              ? "No score display during quiz"
              : roomSettings.reportScores === 1
              ? `After every ${roomSettings.reportScores} question`
              : `After every ${roomSettings.reportScores} questions`}
          </span>
        </div>

        <!-- Container for the Display Question on Player Toggle -->
        <div class="flex items-center justify-center space-x-4 mb-4">
          <label for="questionDisplayOnPlayer" class="text-lg font-medium mr-2">
            Display Question on Player:
          </label>
          <label class="toggle">
            <input
              type="checkbox"
              id="questionDisplayOnPlayer"
              bind:checked={displayQuestionOnPlayer}
              on:change={toggleDisplayQuestionOnPlayer}
            />
            <span class="slider round" />
          </label>
        </div>
      {/if}

      <!-- Create Room Button -->
      <button
        class="h-20 w-2/3 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        on:click={() => {
          createRoom(socket, roomSettings);
        }}
      >
        Create Room
      </button>
    </div>
  </div>
  <div class="md:w-2/3">
    <DmyGame
      {selectedBgColor}
      {selectedBgMusic}
      {showToggleQuestionDisplay}
      {displayQuestionOnPlayer}
    />
  </div>
</div>

<style>
  /* ... other styles ... */

  .toggle {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #6200ea;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #6200ea;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
