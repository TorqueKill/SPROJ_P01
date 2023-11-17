<script lang = "js">
  // @ts-nocheck

  import { SCREENS } from "$lib/constants.js";
  import { user } from "$lib/userStore.js";
  import { socket, socketEvents } from "$lib/socketStore.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { tweened } from 'svelte/motion';
    // import { send } from "vite";

  let isHost;
  let quiz;
  let currentQuestion;
  let isAnswerSubmitted;
  let answerSubmitted;
  let originalTimer = 30; // seconds. Change this to change the timer for every question
  let timeLeft = tweened(originalTimer); // important for reactive state and smooth transition
  let resetTimer = false; // true when next question is loaded
  let timeRanOut = false; // true when time runs out for a question

  $: {
    const events = $socketEvents;
    console.log(events);

    if (events.nextQuestion == 0 || events.nextQuestion) {
      currentQuestion = events.nextQuestion;
      console.log("next question: " + currentQuestion);
      isAnswerSubmitted = false;
      answerSubmitted = "";
      resetTimer = true;
      timeRanOut = false;
    }

    if (events.gameEnd) {
      goto("/gameEnd");
    }
  }
  
  // This function handles all the timer logic

  if (!$user.isHost) {

    setInterval(() => {
      
      // timer is reset when new question is loaded
      if (resetTimer) {
        $timeLeft = originalTimer;
        resetTimer = false;
        return;
      }
      
      // Timer is paused when answer is submitted until next question is loaded
      if (isAnswerSubmitted) {
          return;
      }

      // timer decrement by 1 second every second
      if ($timeLeft > 0) {
        $timeLeft--;

      // Time ran out for this question
      } else if ($timeLeft <= 0 && $timeLeft > -100) {
         
        timeRanOut = true;
        sendAnswer(-1, currentQuestion); // question Index is -1 if time runs out
        // set to -100 so that send answer doesn't get called repeatedly
        $timeLeft = -100; 
      }
      // } else {
      //   $timeLeft = 60;
      // }
    }, 1000);

    
  }

  $: secondsLeft = Math.floor($timeLeft) // important for reactive state


 

  //quiz format:
  //quiz = [{question: "question", answer: "answer", choices: ["choice1", "choice2", "choice3", "choice4"]}, ...]]

  onMount(() => {
    quiz = $user.quiz;
    isHost = $user.isHost; //hosts will display the question
    currentQuestion = -1;
    isAnswerSubmitted = false;
    answerSubmitted = "";

   

    socket.emit("session-loaded", $user.gameid, SCREENS.GAME);

    
  });

  const sendAnswer = (answerIdx, questionIdx) => {
    if (isAnswerSubmitted) {
      return;
    }
    if (answerIdx === -1) {
      answerSubmitted = "Time ran out";
    } else {
      answerSubmitted = quiz[currentQuestion].choices[answerIdx];
    }
    // answerSubmitted = quiz[currentQuestion].choices[answerIdx];
    isAnswerSubmitted = true;
    console.log("Sent answer: ",answerIdx);
    socket.emit("handle-answer", $user.gameid, answerIdx, questionIdx);
  };
</script>

<main>
  <body>
    <h1 id="home">JAM</h1>
    <div class="container">
      {#if currentQuestion == -1}
        <h1 class="loading">Loading...</h1>
      {:else if quiz}
        {#if isHost}
          <h1 id="host-question" class="inside-box">
            {quiz[currentQuestion].question}
            <button
              class="btn btn-secondary btn-block"
              id="createQuiz"
              on:click={() => {
                socket.disconnect();
                socket.connect();
                goto("/");
              }}>Leave Room</button
            >
          </h1>
        {:else if $timeLeft >= 0}
          <h1>Time Left: {secondsLeft}</h1>
          <!-- <p>Time Left: {timeLeft}</p> -->
          <h2 id="chooseOpt" class="inside-option">
            <p id="choose">Choose one</p>
            {#each quiz[currentQuestion].choices as choice, idx}
              <button
                class="btn1 btn-tertiary btn-block"
                id="chooseAnswer"
                on:click={() => sendAnswer(idx, currentQuestion)}
                >{choice}</button
              >
            {/each}
            <p id="answer">You chose:</p>
            <p id="real-answer">{answerSubmitted}</p>
          </h2>
        {:else if $timeLeft == -100}
          <h1>You ran out of time for this question</h1>
          <!-- {sendAnswer(-1, currentQuestion)} -->
          <!-- <h2 id="chooseOpt" class="inside-option">
            <p id="choose">Choose one</p>
            {#each quiz[currentQuestion].choices as choice, idx}
              <button
                class="btn1 btn-tertiary btn-block"
                id="chooseAnswer"
                on:click={() => sendAnswer(idx, currentQuestion)}
                >{choice}</button
              >
            {/each}
            <p id="answer">You chose:</p>
            <p id="real-answer">{answerSubmitted}</p>
          
          </h2> -->
        {/if}
      {/if}
    </div>
  </body>
</main>

<style>
  body {
    background: #7801a8;
  }
  #home {
    color: #f0e9e9;
    font-family: JejuGothic, sans-serif;
    font-size: 36px;
    margin-left: 5rem;
    margin-top: 4rem;
  }
  #host-question {
    color: black;
    font-family: JejuGothic, sans-serif;
    font-weight: bolder;
    margin-left: 19rem;
    margin-top: 7rem;
    padding-left: 8rem;
  }
  .inside-box {
    width: 45rem;
    height: 25rem;
    background: #c49eff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 51px;
    padding-top: 5rem;
  }
  .btn {
    margin-top: 5rem;
    /* margin-right: 6rem; */
    width: 10rem;
    border: None;
    font-family: JejuGothic, sans-serif;
    border-radius: 12px;
    height: 3rem;
    font-size: 20px;
  }
  .btn:active {
    background-color: #800000;
    color: #f0e9e9;
  }
  .btn-secondary {
    background: #c70000;
    border: None;
    margin-top: 12rem;
    margin-left: 12rem;
    font-size: 20px;
    color: white;
    font-family: JejuGothic, sans-serif;
  }
  #chooseOpt {
    color: #f0e9e9;
    font-family: JejuGothic, sans-serif;
    font-size: 36px;
    margin-left: 18rem;
    margin-top: 7rem;
  }
  .inside-option {
    width: 45rem;
    height: 25rem;
    background: #c49eff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 51px;
    padding-top: 5rem;
    padding-left: 8rem;
  }
  .btn-tertiary {
    background: #7801a8;
    color: white;
    margin-top: 2rem;
  }
  .btn1 {
    margin-top: 5rem;
    margin-right: 6rem;
    width: 15rem;
    border: None;
    font-family: JejuGothic, sans-serif;
    border-radius: 12px;
    height: 3rem;
    font-size: 20px;
    transform: translate(0, 110%);
  }
  .btn1:active {
    background-color: #00a59b;
    color: #f0e9e9;
  }
  #answer {
    transform: translate(7%, 150%);
    color: white;
    font-family: JejuGothic, sans-serif;
  }
  #choose {
    transform: translate(25%, -110%);
    margin-bottom: -8rem;
  }
  #real-answer {
    color: #00a59b;
    font-family: JejuGothic, sans-serif;
    transform: translate(40%, -32%);
  }
</style>
