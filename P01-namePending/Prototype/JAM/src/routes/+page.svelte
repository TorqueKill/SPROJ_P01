
<script lang="js">
// @ts-nocheck

    import {io} from 'socket.io-client';
    import {socket} from '$lib/socketStore.js';
    import {goto} from '$app/navigation';

    import {onMount} from 'svelte';


    onMount(() => {

        $socket = io('http://localhost:3001');

    });
    


    const testButton = (soc) => {
        
        soc.emit('test', 'test');
        // socket.emit('hello', 'hello world');
        console.log("hello test");
    };

    


</script>

<button on:click={testButton($socket)}>test</button>
<button on:click={()=>{goto("/waitLobby")}}>waitLobby</button>
<!-- add button with a normal javscript function that emits a socket event -->
<!-- <button on:click={() => socket.emit('test', 'test')}>test2</button>
<button id="test_vanilla_Button">test3</button> -->





