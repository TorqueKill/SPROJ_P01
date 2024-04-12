<script>
    // @ts-nocheck
    import DmyGame from '$lib/dummyPages/dmyGame/+page.svelte'

    const bgMusic = [
        "/music/1.mp3",
        "/music/2.mp3",
        "/music/3.mp3",
        "-1"
    ];

    const bgColors = [
        "bg-gradient-to-br from-purple-400 via-purple-500 via-20% to-purple-900 to-80%",
        "bg-gradient-to-br from-purple-600 via-purple-800 via-20% to-purple-950 to-80%",
        "bg-gradient-to-br from-purple-400 via-violet-700 to-purple-900"
    ];

    let participants = 0;
    let scoreDisplay = 1; // Number of questions after which score is displayed, by default 1 (after every question)
    let bgColorIdx = 0;
    let bgMusicIdx = bgMusic.length - 1;

    let selectedBgColor = bgColors[bgColorIdx];
    let selectedBgMusic = bgMusic[bgMusicIdx]

    function createRoom(){
        // For demonstration purposes, just log the values and return
        console.log(participants, scoreDisplay, bgColors[bgColorIdx], bgMusic[bgMusicIdx]);
    }

    const noMusicIcon = "https://www.svgrepo.com/show/95663/muted-music-notes.svg";

    // Update this function to handle music selection including no music
    function selectBgMusic(index) {
        console.log(index);
        bgMusicIdx = index;
        selectedBgMusic = bgMusic[bgMusicIdx];
    }

    function selectBgColor(index) {
        bgColorIdx = index;
        selectedBgColor = bgColors[bgColorIdx];
    }

    $: selectedBgColor = bgColors[bgColorIdx];
    $: selectedBgMusic = bgMusic[bgMusicIdx];

</script>


<div class="flex flex-col md:flex-row min-h-screen">
    <!-- Container for user input box -->
    <!-- Full-width container for the main content -->
    <div class="md:w-1/3 min-h-screen bg-purple-900 text-white flex flex-col justify-center items-center gap-6 p-6">

        <!-- Centered container for inputs and create room button -->
        <div class="flex flex-col justify-around items-center w-full max-w-md space-y-12">
            <!-- Number of Participants -->
            <div class="flex flex-col items-center w-full ">
                <label for="participants" class="text-lg font-medium ">Number of Participants:</label>
                <input type="number" id="participants" bind:value={participants} class="w-2/3 text-black text-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm" placeholder="Enter number of participants">
            </div>

            <!-- Score Display Frequency -->
            <div class="flex flex-col items-center w-full">
                <label for="scoreDisplay" class="text-lg font-medium">Score Display Frequency:</label>
                <input type="number" id="scoreDisplay" bind:value={scoreDisplay} class="w-2/3 text-black text-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm" placeholder="After how many questions?">
            </div>

            <!-- Room Background Color Selector -->
            <div class="flex flex-col items-center w-full">
                <label class="text-lg font-medium">Room Background Color:</label>
                <div class="flex justify-center items-center gap-4 mt-2 w-2/3 space-x-6">
                    {#each bgColors as color, index}
                    <div on:click={() => selectBgColor(index)} class="cursor-pointer w-10 h-10 shadow-lg {bgColors[index]} {index === bgColorIdx ? "ring-2 ring-purple-600" : ""}" title={color.name}></div>

                    {/each}
                </div>
            </div>

            <!-- Background Music Selector -->
            <div class="flex flex-col items-center w-full">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="text-lg font-medium ">Background Music:</label>
                <div class="flex justify-center items-center gap-4 mt-2 w-full space-x-4">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    {#each bgMusic.slice(0,bgMusic.length-1) as music, index}
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div on:click={() => selectBgMusic(index)} class="cursor-pointer font-bold text-lg p-2 bg-purple-700 rounded {index === bgMusicIdx ? "ring-2 ring-purple-600" : ""}">{index + 1}</div>
                    {/each}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div on:click={() => selectBgMusic(bgMusic.length-1)} class="cursor-pointer font-bold text-lg p-2 bg-purple-700 rounded">
                        <img src={noMusicIcon} class="h-6 w-6" alt="No Music" />
                    </div>
                </div>  
            </div>

            <!-- Create Room Button -->
            <button class="h-20 w-2/3 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" on:click={createRoom}>
                Create Room
            </button>
        </div>
    </div>
    <div class="md:w-2/3">
        <DmyGame {selectedBgColor} {selectedBgMusic}/>
    </div>

</div>




