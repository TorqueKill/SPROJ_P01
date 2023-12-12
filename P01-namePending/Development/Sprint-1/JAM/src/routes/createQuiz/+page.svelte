<script lang="js">
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { quiz1, quiz2, quiz3 } from "$lib/dummyQuiz.js";
  import { onMount } from "svelte";
  import { user } from "$lib/userStore.js";

  let quizzes;
  let displayQuizCheck;
  let quizToDisplay = [];
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

  function displayQuiz(quiz, idx) {
    quizToDisplay = sugarQuiz(quiz);
    displayQuizCheck = true;
    quizIdx = idx;
  }

  const closeQuiz = () => {
    displayQuizCheck = false;
  };

  //MAKE SURE TO SAVE QUIZ FROM THE OG QUIZ ARRAY
  const chooseQuiz = () => {
    $user.hostQuiz = quizzes[quizIdx];
    quizChosen = true;
    displayQuizCheck = false;
  };

  // update questions, answers, options, and time limits
  function updateQuizDetails(quizIdx, questionIdx, field, value, optionIdx) {
    if (field === "question") {
      quizzes[quizIdx][questionIdx].question = value;
    } else if (field === "answer") {
      quizzes[quizIdx][questionIdx].answer = value;
    } else if (field === "options") {
      quizzes[quizIdx][questionIdx].choices[optionIdx] = value;
    } else if (field === "timeLimit") {
      quizzes[quizIdx][questionIdx].timeLimit = parseInt(value, 10);
    }
    // quizzes = [...quizzes];
  }
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
    <div class="quiz-editor">
      {#if displayQuizCheck}
        <h2>Choose or edit the quiz</h2>
        {#each quizToDisplay as question, qIdx}
          <div class="question-block">
            <input
              class="question-input"
              type="text"
              bind:value={question.question}
              on:input={(e) =>
                updateQuizDetails(quizIdx, qIdx, "question", e.target.value)}
            />

            <div class="answer-block">
              <label class="answer-label" for={`answer-${qIdx}`}>Answer:</label>
              <input
                class="answer-input"
                type="text"
                bind:value={question.answer}
                on:input={(e) =>
                  updateQuizDetails(quizIdx, qIdx, "answer", e.target.value)}
              />
            </div>

            <div class="options-block">
              {#each question.options as option, oIdx}
                <div class="option-item">
                  <label class="option-label" for={`option-${qIdx}-${oIdx}`}
                    >Option {oIdx + 1}:</label
                  >
                  <input
                    class="option-input"
                    type="text"
                    bind:value={option}
                    on:input={(e) =>
                      updateQuizDetails(
                        quizIdx,
                        qIdx,
                        "options",
                        e.target.value,
                        oIdx
                      )}
                  />
                </div>
              {/each}
            </div>

            <div class="time-limit-block">
              <label class="time-limit-label" for={`timeLimit-${qIdx}`}
                >Time Limit:</label
              >
              <input
                class="time-limit-input"
                type="number"
                bind:value={question.timeLimit}
                on:input={(e) =>
                  updateQuizDetails(quizIdx, qIdx, "timeLimit", e.target.value)}
              />
            </div>
          </div>
        {/each}
        <button class="btn btn-tertiary" on:click={() => chooseQuiz()}
          >Choose</button
        >
        <button class="btn btn-secondary" on:click={() => closeQuiz()}
          >Close</button
        >
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
    margin-left: 29rem;
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


  .question-block {
    margin-bottom: 20px;
  }

  .answer-block,
  .options-block,
  .time-limit-block {
    margin-top: 10px;
  }

  .option-item {
    margin-top: 5px;
  }

  .question-input {
    display: block;
    width: 80rem;
    margin-bottom: 5px;
    height: 2rem;
    padding-left: 1rem;
    font-size: 20px;
    font-family: JejuGothic, sans-serif;
    font-size: 20px;
    color: #7801a8;
    background: white;
    border-radius: 12rem;
  }
  .answer-input {
    display: block;
    width: 10rem;
    margin-bottom: 5px;
    margin-top: 1rem;
    text-align: center;
    padding-left: -3rem;
    /* padding-top: 0.5rem; */
    color: #c49eff;
    font-family: JejuGothic, sans-serif;
    font-size: 15px;
    border-radius: 12rem;
  }
  .option-input {
    display: block;
    width: 10rem;
    margin-bottom: 5px;
    font-family: JejuGothic, sans-serif;
    font-size: 15px;
    border-radius: 12rem;
    padding-left: 1rem;
    color: #7801a8;
  }

  .time-limit-input {
    color: red;
    /* margin-left: 2rem; */
    font-family: JejuGothic, sans-serif;
    border-radius: 5rem;
    /* padding-left: 2rem; */
    text-align: center;
  }
  .answer-label {
    display: block;
    margin-top: 10px;
    padding-top: 0.5rem;
    font-family: JejuGothic, sans-serif;

  }
  .option-label,
  .time-limit-label {
    display: block;
    margin-top: 10px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-family: JejuGothic, sans-serif;

  }
</style>
