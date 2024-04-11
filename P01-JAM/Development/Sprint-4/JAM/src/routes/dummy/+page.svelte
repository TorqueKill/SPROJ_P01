<script>
// @ts-nocheck

    import DmyBg from '$lib/dummyPages/dmyBg/+page.svelte'
    import DmyBg2 from '$lib/dummyPages/dmyBg2/+page.svelte'
    import DmyBg3 from '$lib/dummyPages/dmyBg3/+page.svelte'
    import DmyGame from '$lib/dummyPages/dmyGame/+page.svelte'
    import DmyQuizSelect from '$lib/dummyPages/dmyQuizSelect/+page.svelte'
    import DmyRoomCreate from '$lib/dummyPages/dmyCreateRoom/+page.svelte'
  
    // Export the components if you want them to be importable from 'index.svelte'
    export { DmyBg, DmyBg2, DmyGame, DmyQuizSelect };
  
    // Or create some routing logic if needed
    let currentComponent = DmyBg;
  
    function showComponent(component) {
      currentComponent = component;
    }
  </script>
  
  <!-- Some basic UI for switching between dummy pages -->
  <div class="flex justify-center space-x-4 bg-gray-500">
    <button class="border" on:click={() => showComponent(DmyBg)}>Background</button>
    <button class="border" on:click={() => showComponent(DmyBg2)}>Background2</button>
    <button class="border" on:click={() => showComponent(DmyBg3)}>Background3</button>
    <button class="border" on:click={() => showComponent(DmyGame)}>Game</button>
    <button class="border" on:click={() => showComponent(DmyQuizSelect)}>QuizSelect</button>
    <button class="border" on:click={() => showComponent(DmyRoomCreate)}>RoomCreate</button>
  </div>
  
  <div>
    <svelte:component this={currentComponent} />
  </div>
  