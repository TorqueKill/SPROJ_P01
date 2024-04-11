<script>
  //@ts-nocheck
  import { writable } from "svelte/store";
  const bg = writable("bg-gradient-to-br from-purple-300 to-purple-900");

  let currentBg = 0

  // Background colors with their allowed min and max range for tailwind classes
  const bgColors = {
    "purple": [300, 900],
    "violet": [300, 900],
    "indigo": [400, 700],
    "blue": [400, 700],
    "fuchsia": [300, 600],
    "pink": [300, 600]
  };

  const bgVariations = [
    "bg-gradient-to-br from-purple-400 via-purple-500 via-20% to-purple-900 to-80%",
    "bg-gradient-to-br from-purple-600 via-purple-800 via-20% to-purple-950 to-80%",
    "bg-gradient-to-br from-purple-400 via-violet-700 to-purple-900"
  ];



 
  function changeBackground() {
    currentBg = (currentBg + 1) % bgVariations.length
    bg.set(bgVariations[currentBg])
  }



  </script>

<div class="flex flex-col min-h-screen justify-center items-center transition-colors duration-500 {$bg}">
  <h1 class="text-white text-center text-4xl mb-4">Background: {currentBg+1}</h1>
  <button class="px-4 py-2 bg-white rounded shadow text-black" on:click={changeBackground}>
    Change Background
  </button>
</div>



