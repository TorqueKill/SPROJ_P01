
<script lang="js">
// @ts-nocheck

    import {io} from 'socket.io-client';
    import {socket, socketEvents} from '$lib/socketStore.js';
    import {user} from '$lib/userStore.js';
    import {quiz3} from '$lib/dummyQuiz.js';
    import {goto} from '$app/navigation';

    import {onMount} from 'svelte';

    let roomid;
    let isRoomFull = false;

    let maxPlayers;

    let _userName;

    $: {
        const events = $socketEvents;
        console.log(events)
        
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
        $user.id = socket.id;
        maxPlayers = 2;
        _userName = $user.userName;

    });
    




    const createRoom = (soc,maxPlayers) => {

        if (maxPlayers < 2 || maxPlayers > 10) {
            alert("max players must be between 2 and 10");
            maxPlayers = 2;
            return;
        }

        soc.emit('create-room', $user.hostQuiz ,maxPlayers);
        console.log("createRoom");
        $user.isHost = true;

        goto("/waitLobby");

    
    };


    const joinRoom = (soc, roomid, username) => {
        if (roomid){
            soc.emit('join-room', roomid, username);
            console.log("joinRoom");

            if (!isRoomFull) {
                $user.gameid = roomid;
                goto("/waitLobby");
            }

        } else {
            alert("please enter a room id");
        }
    };


    const setUserName = (userName) => {
        if (userName) {
            $user.userName = userName;
        } else {
            alert("please enter a username");
        }
    }

    


</script>



<!-- check if socket is connected -->

<h1>HOMEPAGE</h1>

<!--ask if host or player-->
<!--if host, show create room button else show joing room-->


{#if !$user.userDecided}
    <button on:click={() => {$user.isHost=true;$user.userDecided=true}}>Host</button>
    <button on:click={() => {$user.userDecided=true;}}>Join</button>
{:else}
    {#if $user.isHost}
        <input type="number" bind:value={maxPlayers} />
        <button on:click={() => createRoom(socket,maxPlayers)}>Create Room</button>
        <button on:click={() => {goto("/createQuiz");}}>Create Quiz</button>
    {:else}
        <input type="text" bind:value={roomid} />
        <button on:click={() => joinRoom(socket, roomid, $user.userName)}>Join Room</button>
        <input type="text" bind:value={_userName} />
        <button on:click={() => {setUserName(_userName);}}>Set Username</button>
        
    {/if}
{/if}








