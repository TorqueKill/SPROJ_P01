<script>
  // @ts-nocheck

  //------------------------------------PRESISTANCE------------------------------------
  // navigate to main menu if user is disconnected, if user is not logged in, goto login/signup

  import { SCREENS,GAME_SETTINGS } from "$lib/config.js";
  import { user } from "$lib/userStore.js";
  import { socket, roomEvents, gameEvents } from "$lib/socketStore.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { tweened } from "svelte/motion";

  let isHost;
  let quiz;
  let currentQuestion;
  let isAnswerSubmitted;
  let answerSubmitted;
  let originalTimer = GAME_SETTINGS.MAX_TIME_PER_QUESTION;
  let timeLeft = tweened(originalTimer);
  let resetTimer = false; // true when next question is loaded
  let timeRanOut = false; // true when time runs out for a question
  let sessionScores = [];
  let scoreDisplayCheck = false;
  let scoreDisplayTimer = GAME_SETTINGS.SCORE_DISPLAY_TIME;

  onMount(() => {
    quiz = $user.quiz;
    isHost = $user.isHost; //hosts will display the question
    currentQuestion = -1;
    isAnswerSubmitted = false;
    answerSubmitted = "";

    if ($user.currentSession != SCREENS.GAME) {
      $user.currentSession = SCREENS.GAME;
      socket.emit("session-loaded", $user.gameid, SCREENS.GAME);
    }
  });

  //----------------------------REACTIVE CHANGES-------------------------

  $: {
    const events = $gameEvents;
    console.log(events);

    if (events.nextQuestion == 0 || events.nextQuestion) {
      currentQuestion = events.nextQuestion;
      console.log(events);
      isAnswerSubmitted = false;
      answerSubmitted = "";
      resetTimer = true;
      timeRanOut = false;

      // reset score display check to start timer
      scoreDisplayCheck = false;

      //set the event to null so that it doesn't get called repeatedly
      events.nextQuestion = null;
    }

    //check for 'timeout' event
    if (events.timeout) {
      //check if answer was submitted, if not, then send answer

      if (!isAnswerSubmitted) {
        let _currentQuestion = currentQuestion;
        currentQuestion = events.timeout;
        console.log(events);
        isAnswerSubmitted = false;
        answerSubmitted = "";
        resetTimer = true;
        timeRanOut = false;

        console.log("timeout");
        if ($user.reconnected) {
          sendAnswer(-1, currentQuestion - 1); //reconnected user waits till timeout
        } else {
          sendAnswer(-1, _currentQuestion); // Index is -1 if time runs out
        }
      }

      //set the event to null so that it doesn't get called repeatedly
      events.timeout = null;
    }

    if (events.scoresTillQuestion) {
      sessionScores = events.scoresTillQuestion;
      scoreDisplayCheck = true;
      scoreDisplayTimer = events.display_time;
      events.scoresTillQuestion = null;
    }
  }

  $: {
    const events = $roomEvents;
    console.log(events);

    if (events.roomDeleted) {
      socket.disconnect();
      socket.connect();
      goto("/");
    }

    if (events.gameEnd) {
      goto("/gameEnd");
    }
  }

  //---------------------------CLIENT TIMER-----------------------------------

  if (!$user.isHost || scoreDisplayCheck) {
    // timer is only for non-hosts unless score is being displayed
    setInterval(() => {
      if (scoreDisplayCheck) {
        if (scoreDisplayTimer > 0) {
          scoreDisplayTimer--;
        }
        return; // don't run the timer if score is being displayed
      }

      // timer is reset when new question is loaded
      if (resetTimer) {
        $timeLeft = quiz[currentQuestion].timeLimit;
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

        // set to -100 so that send answer doesn't get called repeatedly
        $timeLeft = -100;
      }
    }, 1000);
  }

  $: secondsLeft = Math.floor($timeLeft); // important for reactive state

  //-------------------------------FUNCTIONS---------------------------------

  //quiz format: refer to dummyQuiz.js in lib folder

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
    console.log("Sent answer: ", answerIdx);
    socket.emit("handle-answer", $user.gameid, answerIdx, questionIdx);
  };

  const playerScore = (scoreList) => {
    let score = 0;
    for (let i = 0; i < scoreList.length; i++) {
      if (scoreList[i] == 1) {
        score++;
      }
    }
    return score;
  };
</script>

<main>
  <body>
    <h1 id="home" style="color: #c49eff">JAM</h1>
    <div class="container">
      <!------------------------------- LOADING ------------------------------------------>
      {#if currentQuestion == -1}
        <h1 class="loading">Waiting for Server...</h1>

        <!------------------------------- SCORE DISPLAY ------------------------------------>
      {:else if scoreDisplayCheck}
        <h1>Score Display</h1>
        {#each Object.entries(sessionScores) as [idx, ps]}
          <p>
            {ps.name} score: {playerScore(ps.scores)}
          </p>
        {/each}
        <h1>Next Question in {scoreDisplayTimer} seconds</h1>

        <!------------------------------- QUESTION DISPLAY (HOST)--------------------------------->
      {:else if quiz}
        {#if isHost}
          <h1 id="host-question" class="inside-box container2">
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

          <!------------------------------- ANSWER DISPLAY (PLAYER)--------------------------------->
        {:else if $timeLeft >= 0}
        
          <h1>Time Left: {secondsLeft}</h1>
          <!-- <p>Time Left: {timeLeft}</p> -->
          <h2 id="chooseOpt" class="inside-option container2">
            <p id="choose" style="color: #c49eff">Choose one</p>
            {#each quiz[currentQuestion].choices as choice, idx}
              <button
                class="btn1 btn-tertiary btn-block"
                id="chooseAnswer"
                on:click={() => sendAnswer(idx, currentQuestion)}
                >{choice}</button
              >
            {/each}
            <p id="answer">You chose:</p>
            <p id="real-answer" style="color: white;">{answerSubmitted}</p>
          </h2>
        

          <!------------------------------- TIMEOUT DISPLAY --------------------------------->
        {:else if $timeLeft == -100}
          <h2>You ran out of time for this question</h2>
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
    background-color: #800080;
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
  h1 {
    margin-left: 38rem;
    font-family: JejuGothic, sans-serif;
    margin-top: -3rem;
    color: red;
  }
  .container2 {
    flex-direction: column;
    align-items: center;
    border-radius: 15px;
    background-color: #018198;
    color: #c49eff;
    border: none;
  }
</style>
