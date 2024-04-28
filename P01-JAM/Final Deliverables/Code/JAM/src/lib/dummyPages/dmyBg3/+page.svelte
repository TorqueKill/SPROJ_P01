<script>
    // @ts-nocheck
    import { onMount } from "svelte";

    let svg = 'https://www.svgrepo.com/show/525539/star.svg';
    let svgCount = 100;
    let key = 0; // Used to force re-render of SVGs

    let animationPool = [
        'animate-float-fast',
        'animate-float-medium',
        'animate-float-slow',
    ];


    function biasedRandom() {
        // Generate a random number using the square root of a uniformly distributed random number
        // This biases the distribution towards 0 and 1, away from the middle of the range (0.5)
        let u = Math.random();
        let v = Math.random();
        return u < 0.5 ? Math.sqrt(2 * u) - 1 : 1 - Math.sqrt(2 * (1 - u));
    }

    function getPosition() {
        // Adjust these to scale the output of biasedRandom() which ranges from -1 to 1
        let scale = 80; // 50% offset scale
        let offset = 50; // 50% base offset
        return (biasedRandom() * scale + offset) + '%';
    }

    function getRandomSize() {
        return Math.random() * (5 - 3) + 3; // Random size between 3rem and 5rem
    }


    

</script>

<div class="flex flex-col items-center space-x-4 my-4">
    <input type="number" min="1" max="100" bind:value={svgCount} class="text-black mx-2" />
</div>

<!-- Main container with relative positioning -->
<div class="relative min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 via-20% to-purple-900 text-white flex justify-center items-center">
    
    <!-- SVG container with absolute positioning -->
    <div class="absolute inset-0 overflow-hidden" key={key}>
      {#each Array(svgCount).fill() as _, i (i)}
        <img src={svg} class="absolute {animationPool[Math.floor(Math.random() * 10)%animationPool.length]}" style="top: {getPosition()}; left: {getPosition()}; width: {getRandomSize()}rem;" alt="Floating SVG" />
      {/each}
    </div>

    <!-- Main content, positioned above the floating SVGs -->
    <div class="z-10">
      <!-- Your content goes here -->
      <input type="text" bind:value={svg} class="bg-gray-200 p-2 rounded" />
    </div>
</div>


