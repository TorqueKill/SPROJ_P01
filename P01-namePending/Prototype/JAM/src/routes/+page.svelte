<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script lang="js">

    // import { onMount } from 'svelte';
    import io from 'socket.io-client';
    export const socket = io('http://localhost:3000',);
    import { writable } from 'svelte/store';

    export const socketStore = writable(socket);
    
    socketStore.set(socket);
    
    import {goto} from '$app/navigation';
    

    

    const testButton = () => {
        
        socket.emit('test', 'test');
        // socket.emit('hello', 'hello world');
        console.log("hello test");
    };

    const createGame = () => {
        let player_min = 2;
        let player_max = 4;
        socket.emit('createGame', {player_min, player_max});
        console.log("createGame");

        socket.on('gameCreated', (room_id) => {
            console.log("Game created with room_id: ",room_id);
            goto(`/waitLobby`, {replaceState: true, state: {socket: socket, room_id: room_id}});


        });
    };
    

    


</script>

<button on:click={testButton}>test</button>
<!-- add button with a normal javscript function that emits a socket event -->
<!-- <button on:click={() => socket.emit('test', 'test')}>test2</button>
<button id="test_vanilla_Button">test3</button> -->
<button on:click={createGame}>Create Game</button>
```





