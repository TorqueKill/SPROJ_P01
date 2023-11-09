<script lang = "js">
// @ts-nocheck
    import {SCREENS} from '$lib/constants.js';
    import {user} from '$lib/userStore.js';
    import {socket, socketEvents} from '$lib/socketStore.js';

    import {onMount} from 'svelte';


    let playerScores = [];

    $: {
        const events = $socketEvents;
        console.log(events);

        if (events.finalScores) {
            $user.score = events.finalScores;
            playerScores = $user.score;
        }
    }

    onMount(() => {
        //playerScores = $user.score;
        //eg = [[1,0,1,0], [0,1,0,1]...] where of 1 list = questions
        socket.emit('session-loaded', $user.gameid, SCREENS.SCORE);
    });


    const playerScore = (scoreList) =>{
        let score = 0;
        for (let i = 0; i < scoreList.length; i++){
            if (scoreList[i] == 1){
                score++;
            }
        }
        return score;
    }


</script>

<h1>Game End</h1>
<!--Display all scores, scores are sent via [0,1,0,1] where length = questions-->

{#if playerScores.length == 0}
    <p>Waiting for scores...</p>
{:else}
    {#each playerScores as ps,idx}
    <p>Player {idx+1} score: {playerScore(ps)}/{playerScores[idx].length}</p>
    {/each}
{/if}
