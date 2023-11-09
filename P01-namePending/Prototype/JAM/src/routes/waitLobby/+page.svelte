<h1>Waiting for all Players to Join</h1>

<script lang="js">
// @ts-nocheck

    import {socket} from '$lib/socketStore.js';

    const testButton = (soc) => {
        
        soc.emit('test', 'test');
        // socket.emit('hello', 'hello world');
        console.log("hello test");
    };



</script>


<button on:click={testButton($socket)}>test</button>