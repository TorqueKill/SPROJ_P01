
<script lang="js">
// @ts-nocheck

    import {io} from 'socket.io-client';
    import {socket, socketEvents} from '$lib/socketStore.js';
    import {user} from '$lib/userStore.js';
    import {quiz1} from '$lib/dummyQuiz.js';
    import {goto} from '$app/navigation';

    import {onMount} from 'svelte';


    let roomid;
    let isRoomFull = false;

    let dummyQuiz = quiz1;

    $: {
        const events = $socketEvents;
        if (events.roomCreated) {
            $user.gameid = events.roomCreated;
        }

        if (events.roomFull) {
            //alert
            alert("room full");
            isRoomFull = true;
            roomid = "";
        }

    }

    



    // onMount(() => {

    //     $socket = io('http://localhost:3001');

    // });


    // $socket.on('room-created', (roomid) => {
    //     console.log("room created: " + roomid);
    //     display = roomid;
    // });


    onMount(() => {
        $user.id = socket.id;
    });
    


    const testButton = (soc) => {
        
        soc.emit('test', 'test');
        // socket.emit('hello', 'hello world');
        console.log("hello test");
    };


    const createRoom = (soc) => {
        soc.emit('create-room', dummyQuiz);
        console.log("createRoom");
        $user.isHost = true;

        goto("/waitLobby");

    
    };


    const joinRoom = (soc, roomid) => {
        soc.emit('join-room', roomid);
        console.log("joinRoom");
        if (!isRoomFull) {
            $user.gameid = roomid;
            goto("/waitLobby");
        }
    };

    


</script>



<!-- check if socket is connected -->

<h1>HOMEPAGE</h1>

<button on:click={()=>testButton(socket)}>test</button>
<button on:click={()=>{goto("/waitLobby")}}>waitLobby</button>
<button on:click={()=>createRoom(socket)}>createRoom</button>

<input type="text" bind:value={roomid} />
<button on:click={()=>joinRoom(socket, roomid)}>joinRoom</button>









