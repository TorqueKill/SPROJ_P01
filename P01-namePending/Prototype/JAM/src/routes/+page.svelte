
<script lang="js">
// @ts-nocheck

    import {io} from 'socket.io-client';
    import {socket, socketEvents} from '$lib/socketStore.js';
    import {goto} from '$app/navigation';

    import {onMount} from 'svelte';


    let display = "test";
    let roomid;

    $: {
        const events = $socketEvents;
        if (events.roomCreated) {
            display = events.roomCreated;
        }

        if (events.roomJoined) {
            goto("/waitLobby");
        }

    }



    // onMount(() => {

    //     $socket = io('http://localhost:3001');

    // });


    // $socket.on('room-created', (roomid) => {
    //     console.log("room created: " + roomid);
    //     display = roomid;
    // });

    


    const testButton = (soc) => {
        
        soc.emit('test', 'test');
        // socket.emit('hello', 'hello world');
        console.log("hello test");
    };


    const createRoom = (soc) => {
        soc.emit('create-room');
        console.log("createRoom");
    
    };


    const joinRoom = (soc, roomid) => {
        soc.emit('join-room', roomid);
        console.log("joinRoom");
        goto("/waitLobby");
    };

    


</script>



<!-- check if socket is connected -->


<h1>{display}</h1>


<button on:click={()=>testButton(socket)}>test</button>
<button on:click={()=>{goto("/waitLobby")}}>waitLobby</button>
<button on:click={()=>createRoom(socket)}>createRoom</button>

<input type="text" bind:value={roomid} />
<button on:click={()=>joinRoom(socket, roomid)}>joinRoom</button>









