
<script lang="js">
// @ts-nocheck

    import {io} from 'socket.io-client';
    import {socket, socketEvents} from '$lib/socketStore.js';
    import {user} from '$lib/userStore.js';
    import {quiz3} from '$lib/dummyQuiz.js';
    import {goto} from '$app/navigation';

    import {onMount} from 'svelte';

    let isHost;
    let userDecided;

    let roomid;
    let isRoomFull = false;

    let dummyQuiz = quiz3;
    let maxPlayers;

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

    


    onMount(() => {
        userDecided = false;
        $user.id = socket.id;
        maxPlayers = 2;
    });
    




    const createRoom = (soc,maxPlayers) => {

        if (maxPlayers < 2 || maxPlayers > 10) {
            alert("max players must be between 2 and 10");
            maxPlayers = 2;
            return;
        }

        soc.emit('create-room', dummyQuiz,maxPlayers);
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

<!--ask if host or player-->
<!--if host, show create room button else show joing room-->


{#if !userDecided}
    <button on:click={() => {isHost=true;$user.isHost=true;userDecided=true}}>Host</button>
    <button on:click={() => {isHost=false;userDecided=true;}}>Join</button>
{:else}
    {#if isHost}
        <input type="number" bind:value={maxPlayers} />
        <button on:click={() => createRoom(socket,maxPlayers)}>Create Room</button>
    {:else}
        <input type="text" bind:value={roomid} />
        <button on:click={() => joinRoom(socket, roomid)}>Join Room</button>
    {/if}
{/if}








