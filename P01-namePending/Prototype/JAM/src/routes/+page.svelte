<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script lang="js">

    // import { onMount } from 'svelte';
    import io from 'socket.io-client';
    const socket = io('http://localhost:3000');
    

    // make a button for creating game

    // onMount(() => {
        
    //     testButton = () => {
    //         socket.emit('test', 'test');
    //     }
    // });

    const testButton = () => {
        socket.emit('test', 'test');
        socket.emit('hello', 'hello world');
        console.log("hello test");
    };
    // socket.emit('test', 'test');

    


</script>

<button on:click={testButton}>test</button>


