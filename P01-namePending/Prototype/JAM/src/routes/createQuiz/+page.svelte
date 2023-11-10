<script>
// @ts-nocheck

    import { goto } from '$app/navigation';
    import { quiz1, quiz2, quiz3 } from '$lib/dummyQuiz.js';
    import {onMount} from 'svelte';
    import {user} from '$lib/userStore.js';

    let quizzes;
    let displayQuizCheck;
    let quizToDisplay;
    let quizChosen;

    let quizIdx;

    onMount(() => {
        //append more from local storage if any
        quizzes = [quiz1,quiz2,quiz3];


        displayQuizCheck = false;
        console.log(quizzes);
    });

    //need to sugar quiz if its in the format of quiz1,2,3
    //which is [{question,answer,choices:[choice1,choice2,choice3,choice4]}, ...]
    const sugarQuiz = (quiz) =>{
        //wrap each question in []
        let newQuiz = [];
        for (let x in quiz){
            //also wrap choices in []
            let newChoices = [];
            for (let y in quiz[x].choices){
                newChoices.push(quiz[x].choices[y]);
            }
            newQuiz.push({
                question: quiz[x].question,
                answer: quiz[x].answer,
                options: newChoices
            });
        }
        return newQuiz;
    }

    const displayQuiz = (quiz,idx)=>{
        quizToDisplay = sugarQuiz(quiz)
        console.log(quizToDisplay);
        displayQuizCheck = true;
        quizIdx = idx;

        
    }

    const closeQuiz = ()=>{
        displayQuizCheck = false;
    }

    //MAKE SURE TO SAVE QUIZ FROM THE OG QUIZ ARRAY
    const chooseQuiz = () =>{

        $user.hostQuiz = quizzes[quizIdx];
        quizChosen = true;
        displayQuizCheck = false;


    }


</script>

<h2>Create Quiz</h2>

<h5>Quizzes on local:</h5>
{#if quizzes}
{#each quizzes as quiz,idx}
    <button on:click={()=>displayQuiz(quiz,idx)}>Quiz {idx+1}</button>
{/each}
{/if}

{#if displayQuizCheck}
    {#each quizToDisplay as question,idx}
        <p>Question {idx+1}: {question.question}</p>
        <p>Answer: {question.answer}</p>
        {#each question.options as option}
            <p>{option}</p>
        {/each}
    {/each}

    <button on:click={()=>{chooseQuiz();}}>Choose</button>
    <button on:click={()=>{closeQuiz();}}>Close</button>

{/if}

{#if quizChosen}
    <p>Quiz Chosen: { quizIdx+1 }</p>
{/if}

<button on:click={()=>{goto('/');}}>go back</button>
