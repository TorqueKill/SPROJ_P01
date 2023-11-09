<script lang="js">
// @ts-nocheck

    import {SCREENS} from '$lib/constants.js';
    import {user} from '$lib/userStore.js';
    import {socket, socketEvents} from '$lib/socketStore.js';
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';

    let isHost;
    let quiz;
    let currentQuestion;
    let isAnswerSubmitted;
    let answerSubmitted;

    $: {
        const events = $socketEvents;
        console.log(events);

        if (events.nextQuestion == 0 || events.nextQuestion) {
            currentQuestion = events.nextQuestion;
            console.log("next question: " + currentQuestion);
            isAnswerSubmitted = false;
            answerSubmitted = "";
        }

        if (events.gameEnd) {
            goto('/gameEnd');
        }
    }

    //quiz format:
    //quiz = [{question: "question", answer: "answer", choices: ["choice1", "choice2", "choice3", "choice4"]}, ...]]

    onMount(() => {
        quiz = $user.quiz;
        isHost = $user.isHost;   //hosts will display the question
        currentQuestion = -1;
        isAnswerSubmitted = false;
        answerSubmitted = "";

        socket.emit('session-loaded', $user.gameid, SCREENS.GAME);
    });


    const  sendAnswer = (answerIdx, questionIdx) => {
        if (isAnswerSubmitted) {
            return;
        }
        answerSubmitted = quiz[currentQuestion].choices[answerIdx];
        isAnswerSubmitted = true;
        socket.emit('handle-answer', $user.gameid ,answerIdx, questionIdx);
    }







</script>


{#if currentQuestion == -1}
<h3>Loading...</h3>
{:else}
    {#if quiz}
        {#if isHost}
            <h1>Question: {quiz[currentQuestion].question}</h1>
        {:else}
            <h2>Choices:</h2>
            {#each quiz[currentQuestion].choices as choice, idx}
                <button on:click={()=>sendAnswer(idx, currentQuestion)}>{choice}</button>
            {/each}
            <h5>Answer: {answerSubmitted}</h5>
        {/if}
    {/if}


{/if}