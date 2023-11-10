<script lang "js">
  // @ts-nocheck

  import { SCREENS } from "$lib/constants.js";
  import { user } from "$lib/userStore.js";
  import { socket, socketEvents } from "$lib/socketStore.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

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
      goto("/gameEnd");
    }
  }

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
    answerSubmitted = quiz[currentQuestion].choices[answerIdx];
    isAnswerSubmitted = true;
    socket.emit("handle-answer", $user.gameid, answerIdx, questionIdx);
  };
</script>

<main>
  <body>
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
        {:else}
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
        {/if}
      {/if}
    </div>
  </body>
</main>

<style>
  body {
    background: #7801a8;
  }
  #host-question {
    color: black;
    font-family: JejuGothic, sans-serif;
    font-weight: bolder;
    margin-left: 19rem;
    margin-top: 12rem;
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
    margin-top: 11rem;
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
