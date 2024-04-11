<script>
    // @ts-nocheck
    const bgMusic = [
        "/music/1.mp3",
        "/music/2.mp3",
        "/music/3.mp3"  
    ];

    const bgColors = [
        "bg-gradient-to-br from-purple-400 via-purple-500 via-20% to-purple-900 to-80%",
        "bg-gradient-to-br from-purple-600 via-purple-800 via-20% to-purple-950 to-80%",
        "bg-gradient-to-br from-purple-400 via-violet-700 to-purple-900"
    ];

    let participants = 0;
    let scoreDisplay = 1; // Number of questions after which score is displayed, by default 1 (after every question)
    let bgColorIdx = 0;
    let bgMusicIdx = 0;

    function createRoom(){
        // For demonstration purposes, just log the values and return
        console.log(participants, scoreDisplay, bgColors[bgColorIdx], bgMusic[bgMusicIdx]);
    }

    function selectBgColor(index) {
        bgColorIdx = index;
    }
</script>

<div class="{bgColors[bgColorIdx]} min-h-screen flex flex-col items-center justify-center p-4">
    <div class="w-full  p-5 bg-white rounded-lg shadow-xl max-w-4xl">
        <h2 class="text-2xl font-bold text-center mb-6">Create a Room</h2>
        <div class="mb-4">
            <label for="participants" class="block text-sm font-medium text-gray-700">Number of Participants</label>
            <input type="number" id="participants" bind:value={participants} class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter number of participants">
        </div>
        <div class="mb-4">
            <label for="scoreDisplay" class="block text-sm font-medium text-gray-700">Score Display Frequency</label>
            <input type="number" id="scoreDisplay" bind:value={scoreDisplay} class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="After how many questions?">
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Room Background Color</label>
            <div class="flex space-x-4">
                {#each bgColors as color, index}
                    <div on:click={() => selectBgColor(index)} class="cursor-pointer w-10 h-10 shadow-lg {bgColors[index]}" title={color.name}></div>
                {/each}
            </div>
        </div>
        <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">Background Music</label>
            <select bind:value={bgMusicIdx} class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                {#each bgMusic as music, index}
                    <option value={index}>{music}</option>
                {/each}
            </select>
        </div>
        <button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" on:click={createRoom}>Create Room</button>
    </div>
</div>

<style>
    /* You can add additional global styles here */
</style>
