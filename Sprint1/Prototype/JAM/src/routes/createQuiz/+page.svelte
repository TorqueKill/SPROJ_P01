<script lang="js">
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { quiz1, quiz2, quiz3 } from "$lib/dummyQuiz.js";
  import { onMount } from "svelte";
  import { user } from "$lib/userStore.js";

  let quizzes;
  let displayQuizCheck;
  let quizToDisplay;
  let quizChosen;

  let quizIdx;

  onMount(() => {
    //append more from local storage if any
    const savedQuizzes = JSON.parse(localStorage.getItem("Quiz")) || [];
    console.log(savedQuizzes);

    quizzes = [quiz1, quiz2, quiz3, ...savedQuizzes];
    displayQuizCheck = false;
    console.log(quizzes);
  });

  //need to sugar quiz if its in the format of quiz1,2,3
  //which is [{question,answer,choices:[choice1,choice2,choice3,choice4]}, ...]
  const sugarQuiz = (quiz) => {
    //wrap each question in []
    let newQuiz = [];
    for (let x in quiz) {
      //also wrap choices in []
      let newChoices = [];
      for (let y in quiz[x].choices) {
        newChoices.push(quiz[x].choices[y]);
      }
      newQuiz.push({
        question: quiz[x].question,
        answer: quiz[x].answer,
        options: newChoices,
        timeLimit: quiz[x].timeLimit,
      });
    }
    return newQuiz;
  };

  const displayQuiz = (quiz, idx) => {
    quizToDisplay = sugarQuiz(quiz);
    console.log(quizToDisplay);
    displayQuizCheck = true;
    quizIdx = idx;
  };

  const closeQuiz = () => {
    displayQuizCheck = false;
  };

  //MAKE SURE TO SAVE QUIZ FROM THE OG QUIZ ARRAY
  const chooseQuiz = () => {
    $user.hostQuiz = quizzes[quizIdx];
    quizChosen = true;
    displayQuizCheck = false;
  };
</script>

<main>
  <body>
    <h1 id="home">JAM</h1>
    <h2>Create Quiz</h2>
    {#if displayQuizCheck}
      <h5>SCROLL DOWN TO VIEW</h5>
    {:else}
      <h5>Note: Only saves 1 quiz (quiz 4)</h5>
      <h5>Quiz 1,2,3 are dummy quizzes</h5>
    {/if}

    <div id="quizChosen">
      {#if quizChosen}
        <p>You choose quiz: {quizIdx + 1}</p>
      {/if}
    </div>

    <div class="container">
      <div
        class="container mt-4 mb-5 d-flex justify-content-center"
        id="inside-box"
      >
        {#if quizzes}
          {#each quizzes as quiz, idx}
            <button
              class="btn btn-primary btn-block"
              id="quizNo"
              on:click={() => displayQuiz(quiz, idx)}>Quiz {idx + 1}</button
            >
          {/each}
        {/if}
        <button
          class="btn btn-tertiary btn-block"
          id="createNew"
          on:click={() => {
            goto("/CreateQuestion");
          }}>Create new Quiz</button
        >

        <button
          class="btn btn-secondary btn-block"
          id="goBack"
          on:click={() => {
            goto("/");
          }}>Go back</button
        >
      </div>
    </div>
    <div class="quiz-load">
      {#if displayQuizCheck}
        <h2 id="chooseQuizHead">Choose the quiz</h2>
        {#each quizToDisplay as question, idx}
          <p id="question" class="card-header">
            Question {idx + 1}: {question.question}
          </p>
          <p id="answer">Answer: {question.answer}</p>
          {#each question.options as option}
            <p id="option">{option}</p>
          {/each}
          <p id="time-limit">Time limit: {question.timeLimit}</p>
        {/each}
        <div class="btn-group">
          <button
            class="btn btn-secondary btn-block"
            id="choose"
            on:click={() => {
              chooseQuiz();
            }}>Choose</button
          >
          <button
            class="btn btn-secondary btn-block"
            id="goBack1"
            on:click={() => {
              closeQuiz();
            }}>Close</button
          >
        </div>
      {/if}
    </div>
  </body>
</main>

<style>
  body {
    background: #7801a8;
  }
  .container {
    margin-top: 6rem;
    margin-left: 17rem;
  }
  #home {
    color: #f0e9e9;
    font-family: JejuGothic, sans-serif;
    font-size: 36px;
    margin-left: 5rem;
    margin-top: 4rem;
  }
  #inside-box {
    width: 20rem;
    height: 26rem;
    background: #c49eff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 51px;
    padding-top: 2rem;
    margin-bottom: 8rem;
  }
  .btn {
    /* margin-top: 5rem; */
    margin-right: 6rem;
    width: 5rem;
    border: None;
    font-family: JejuGothic, sans-serif;
    border-radius: 12px;
    height: 2.76rem;
    font-size: 20px;
  }
  .btn-tertiary:active {
    background-color: #005550;
    color: #f0e9e9;
    border: None;
  }
  .btn-primary {
    background: #00a59b;
    border: None;
    font-size: 20px;
    color: white;
    font-family: JejuGothic, sans-serif;
  }
  #quizNo {
    margin-top: 0.75rem;
    margin-left: 7.5rem;
  }
  .btn-secondary {
    background: #c70000;
    border: None;
    margin-top: 3rem;
    margin-left: 6.75rem;
    font-size: 20px;
    color: white;
    width: 6.5rem;
    font-family: JejuGothic, sans-serif;
  }
  .btn-secondary:active {
    background-color: #850101;
    color: white;
    border: None;
  }
  h2 {
    color: white;
    font-family: JejuGothic, sans-serif;
    font-size: 45px;
    margin-left: 36rem;
    margin-top: -2rem;
  }
  h5 {
    color: rgb(216, 53, 53);
    font-family: JejuGothic, sans-serif;
    margin-left: 38.7rem;
  }
  .btn-tertiary {
    background: #00a59b;
    border: None;
    margin-top: 1rem;
    margin-left: 4.5rem;
    font-size: 20px;
    color: white;
    width: 12rem;
    font-family: JejuGothic, sans-serif;
  }
  #quizChosen {
    color: rgb(216, 53, 53);
    font-family: JejuGothic, sans-serif;
    margin-left: 39.5rem;
  }
  #question {
    font-family: JejuGothic, sans-serif;
    font-size: 20px;
    color: #7801a8;
    background: white;
    width: 50rem;
    height: 2rem;
    border-radius: 12px;
    margin-left: 1rem;
    margin-top: 2rem;
    padding-left: 1rem;
    padding-top: 0.5rem;
  }
  #chooseQuizHead {
    color: white;
    font-family: JejuGothic, sans-serif;
    font-size: 45px;
    margin-left: 33rem;
    margin-top: 4rem;
  }
  #answer {
    margin-left: 1rem;
    margin-top: 2rem;
    padding-left: 1rem;
    padding-top: 0.5rem;
    color: #c49eff;
    font-family: JejuGothic, sans-serif;
  }
  #option {
    margin-left: 1rem;
    margin-top: -1rem;
    padding-left: 1rem;
    padding-top: 0.5rem;
    color: black;
    font-family: JejuGothic, sans-serif;
  }
  #choose {
    background: #00a59b;
    margin-left: 1rem;
  }
  #choose:active {
    background: #018279;
    border: None;
  }
  #goBack1 {
    margin-left: 31rem;
  }
  #time-limit {
    color: red;
    margin-left: 2rem;
    font-family: JejuGothic, sans-serif;
  }
</style>
