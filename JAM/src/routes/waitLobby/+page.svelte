<h1>Waiting for all Players to Join</h1>

<script lang="js">
// @ts-nocheck

    import {socket, socketEvents} from '$lib/socketStore.js';
    import {user} from '$lib/userStore.js';

    import {goto} from '$app/navigation';

    let playersReady = 0;

    $: {
        const events = $socketEvents;
        console.log(events);

        if (events.roomJoined) {
            playersReady = events.roomJoined.num
        }

        if (events.roomLeft) {
            playersReady = events.roomLeft.num
        }

        if (events.gameStarted) {
            $user.quiz = events.gameStarted;
            console.log($user.quiz);
            goto('/gameSession');
        }
    }



    const testButton = (soc) => {
        
        soc.emit('test', 'test');
        // socket.emit('hello', 'hello world');
        console.log("hello test");
    };



</script>


<h3>Players Ready: {playersReady}</h3>
{#if $user.isHost}
    <h4>Host id: {$user.gameid}</h4>
{/if}

<button on:click={()=>testButton(socket)}>test</button>

