<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { user } from "$lib/userStore.js";

  const MAX_TIME_LIMIT = 60;
  let showHostSettingsModal = false;

  const openHostSettingsModal = () => {
    showHostSettingsModal = true;
  };

  const closeHostSettingsModal = () => {
    showHostSettingsModal = false;
  };

  // @ts-nocheck

  let quizzes;
  let displayQuizCheck;
  let quizToDisplay = [];
  let quizChosen;
  let quizIdx;
  let isQuizSelected = false;
  let selectedQuestionIndex = 0;

  function selectQuestion(index) {
    selectedQuestionIndex = index;
  }

  // onMount(() => {
  //   //append more from local storage if any
  //   const savedQuizzes = JSON.parse(localStorage.getItem("Quiz")) || [];
  //   console.log(savedQuizzes);
  //   // localStorage.setItem("Quiz", JSON.stringify(savedQuizzes));

  //   quizzes = [...savedQuizzes];
  //   displayQuizCheck = false;
  //   console.log(quizzes);
  // });

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
    //console.log(quizzes);
    quizToDisplay = sugarQuiz(quiz);
    displayQuizCheck = true;
    quizIdx = idx;
  }

  const closeQuiz = () => {
    displayQuizCheck = false;
  };

  //MAKE SURE TO SAVE QUIZ FROM THE OG QUIZ ARRAY
  // const chooseQuiz = () => {
  //   $user.hostQuiz = quizzes[quizIdx];
  //   quizChosen = true;
  //   displayQuizCheck = false;
  //   isQuizSelected = true;
  // };

  let quiz1 = [
    {
      question: "",
      answer: "",
      choices: ["", "", "", ""],
      timeLimit: 30,
      imageUrl: "",
    },
  ];

  function addQuestion() {
    quiz1.push({
      question: "",
      answer: "",
      choices: ["", "", "", ""],
      timeLimit: 30,
      imageUrl: "",
    });
    quiz1 = quiz1;
    selectQuestion(quiz1.length - 1); // Select the new question
  }

  function updateAnswer(questionIndex, choiceText) {
    quiz1[questionIndex].answer = choiceText;
  }

  function updateQuestionText(questionIndex, event) {
    const target = event.currentTarget;
    quiz1[questionIndex].question = target.value;
  }

  function updateOptionText(questionIndex, optionIndex, event) {
    const target = event.currentTarget;
    quiz1[questionIndex].choices[optionIndex] = target.value;
  }

  function updateImageUrl(questionIndex, event) {
    const target = event.currentTarget;
    quiz1[questionIndex].imageUrl = target.value;
  }

  function populateIfBlank(quiz) {
    for (let i = 0; i < quiz.length; i++) {
      if (quiz[i].question == "") {
        quiz[i].question = "Question " + (i + 1);
      }
      for (let j = 0; j < quiz[i].choices.length; j++) {
        if (quiz[i].choices[j] == "") {
          quiz[i].choices[j] = "Option " + (j + 1);
        }
      }
      if (quiz[i].answer == "") {
        quiz[i].answer = quiz[i].choices[0];
      }
    }
    return quiz;
  }

  function increaseTime(questionIndex) {
    if (quiz1[questionIndex].timeLimit < MAX_TIME_LIMIT) {
      quiz1[questionIndex].timeLimit += 5;
    }
  }

  function saveQuiz() {
    let saveingQuiz = quiz1;
    populateIfBlank(saveingQuiz);
    console.log(saveingQuiz);
    localStorage.setItem("Quiz", JSON.stringify([quiz1]));
    // goto("/createRoom");
    $user.hostQuiz = saveingQuiz;
    quizChosen = true;
    isQuizSelected = true;
  }

  const logout = async () => {
    try {
      // Call the logout method from your authentication service
      //await authService.logout();

      // Redirect to the login page or any other desired page after logout
      goto("/signIn");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
</script>

<nav>
  <ul>
    <li class="logo">JAM</li>
    <li><button class="nav_button" on:click={() => goto("/")}>Home</button></li>
    <li>
      <button class="nav_button" on:click={() => goto("/viewHistory")}
        >History</button
      >
    </li>
    <li><button class="nav_button" on:click={logout}>Logout</button></li>
    {#if $user.isHost}
      <!-- Show Host Settings button only if the user is a host -->
      <li>
        <button class="nav_button" on:click={openHostSettingsModal}
          >Host Settings</button
        >
      </li>
    {/if}
  </ul>
</nav>

<main class="main-flex-container">
  <div class="left-sidebar">
    {#each quiz1 as question, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="question-preview {index === selectedQuestionIndex
          ? 'active-question'
          : ''}"
        on:click={() => selectQuestion(index)}
      >
        Question {index + 1}
      </div>
    {/each}
    <div class="sidebar-footer">
      <button
        class="btn btn-secondary btn-block btn-space ml-auto"
        on:click={addQuestion}>Add Question</button
      >
    </div>
  </div>

  <div class="content">
    {#if quiz1.length > 0}
      <div class="question-cont">
        <div class="quizz">
          <label for={`question-${selectedQuestionIndex}`}
            >Question {selectedQuestionIndex + 1}</label
          >
          <input
            type="text"
            id={`question-${selectedQuestionIndex}`}
            class="form-control quizz"
            placeholder="Type your question here"
            bind:value={quiz1[selectedQuestionIndex].question}
            on:input={(event) =>
              updateQuestionText(selectedQuestionIndex, event)}
          />
        </div>

        <div class="options-container">
          {#each quiz1[selectedQuestionIndex].choices as choice, oIndex}
            <div class="option-group">
              <input
                type="text"
                class="form-control options"
                placeholder="Enter option"
                bind:value={choice}
                on:input={(event) =>
                  updateOptionText(selectedQuestionIndex, oIndex, event)}
              />
              <input
                type="radio"
                class="form-check-input"
                bind:group={quiz1[selectedQuestionIndex].answer}
                value={choice}
                on:change={() => updateAnswer(selectedQuestionIndex, choice)}
              />
            </div>
          {/each}
        </div>
      </div>

      <div class="image-input-container">
        <div class="quizz">
          <label for={`image-url-${selectedQuestionIndex}`}
            >Image URL (optional)</label
          >
          <input
            type="text"
            id={`image-url-${selectedQuestionIndex}`}
            class="form-control quizz"
            placeholder="Enter image URL"
            bind:value={quiz1[selectedQuestionIndex].imageUrl}
            on:input={(event) => updateImageUrl(selectedQuestionIndex, event)}
          />
        </div>
        {#if quiz1[selectedQuestionIndex].imageUrl}
          <img
            src={quiz1[selectedQuestionIndex].imageUrl}
            class="image-preview"
            alt={`Image for Question ${selectedQuestionIndex + 1}`}
            on:error={(e) => {
              e.target.onerror = null;
              e.target.src = "path_to_placeholder_image";
            }}
          />
        {/if}
      </div>

      <div class="time-limit-container">
        <button
          class="time-limit-button"
          on:click={() => increaseTime(selectedQuestionIndex)}
        >
          Time limit: {quiz1[selectedQuestionIndex].timeLimit} seconds
        </button>
      </div>
    {/if}
  </div>

  <div class="right-sidebar">
    <div class="sidebar-footer">
      <button
        on:click={() => {
          saveQuiz();
        }}
        class="btn btn-secondary btn-block btn-space ml-auto"
      >
        Save and Choose
      </button>
    </div>
    {#if isQuizSelected}
      <button
        class="btn btn-primary btn-block"
        id="quizNo"
        on:click={() => goto("/createRoom")}
      >
        Proceed
      </button>
    {/if}

    <div class="col-auto" id="cancelBtn">
      <button
        class="btn btn-quaternary"
        on:click={() => {
          // goto("/createQuiz");
          goto("/hostOrPlayer");
        }}>Back</button
      >
    </div>
  </div>
</main>

<style>
  .time-limit-container {
    align-self: center; 
    padding: 10px 0; 
    margin-top: 10rem;
  }
  .image-input-container {
    display: flex;
    flex-direction: column; 
    align-items: center;
    margin-bottom: -6rem;
    width: 100%;
  }

  .image-preview {
    max-width: 100px; 
    max-height: 100px; 
    margin-top: 5rem;
    margin-bottom: -9rem;
  }

  .question-preview {
    font-family: JejuGothic, sans-serif; 
    cursor: pointer;
    padding: 10px;
    border-radius: 15px; 
    transition: background-color 0.3s; 
    background: #c49eff;
    margin-bottom: 1.25rem;
    color: #ccc;
    font-size: 18px;
  }

  .question-preview:hover {
    background-color: #7801a8; 
  }
  .main-flex-container {
    display: flex;
    flex-direction: row;
    height: calc(100vh - 40px);
    padding-top: 40px;
    background: #7801a8;
  }

  .left-sidebar {
    width: 12%; 
    background-color: #018198;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    overflow-y: auto;
    /* position: fixed; */
    height: calc(100vh - 90px);
  }

  .right-sidebar {
    width: 12%;
    background: #018198;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    overflow-y: auto;
  }

  .sidebar-footer {
    margin-top: auto;
  }

  .add-question-btn {
    background-color: #ccc;
    color: white;
    padding: 15px 20px;
    margin-left: 2.5rem;
    justify-content: center;
    text-align: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-family: JejuGothic, sans-serif;
    border-radius: 15px;
  }



  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    overflow-y: auto;
    background: #c49eff;
    padding: 45px;
    border-radius: 51px;
    margin: 0 auto; 
    max-width: 800px;
    width: 80%; 
    height: calc(100vh - 170px); 
  }



  .container {
    height: auto;
    background: #c49eff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 51px;
    padding: 2rem;
    margin: 4rem auto 1rem;
    display: flex;
    flex-direction: column;
  }
  .logo {
    color: rgb(214, 81, 209);
    font-size: 25px;
    padding-right: 60%;
    font-weight: bold;
  }

  .nav_button {
    background-color: #ccc;
    border: none;
    color: white;
    padding: 1px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 20px;
    margin: 6px 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease;
    font-family: JejuGothic, sans-serif;
  }
  .nav_button:hover {
    background-color: #c49eff;
  }

  .btn {
    background-color: #ccc;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease;
  }

  .btn:hover {
    background-color: #c49eff;
  }

  #cancelBtn .btn-quaternary:hover {
    background-color: red;
  }

  .options-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    margin-top: 3rem;
  }

  .option-group {
    display: flex;
    align-items: center;
    flex-basis: calc(50% - 5px); 
  }

  .question-cont {
    position: relative;
    margin-bottom: -8rem;
    margin-top: 2rem;
  }

  .btn-quaternary:hover {
    background-color: red;
  }

  .form-check-input {
    position: relative;
    z-index: 1;
    margin-top: 1.75rem;
    margin-left: 0.75rem;
  }

  .form-control.options {
    margin-left: 5.25rem;
    margin-top: 1.5rem;
    border-radius: 15px;
    border: None;
    height: 2rem;
    padding-left: 0.5rem;
    width: 50%;
  }

  .quizz {
    font-size: 22px;
    border-radius: 15px;
    border: None;
    padding-left: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    color: #7801a8;
    height: 2rem;
    width: 100%;
    flex-grow: 2;
    margin-right: 10px; 
  }

  @media screen and (max-width: 768px) {
    .container {
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }

    .btn {
      padding: 10px;
      font-size: 14px;
      border-radius: 15px;
    }
  }

  @media screen and (min-width: 769px) {
    .container {
      padding: 2rem;
    }

    .btn {
      padding: 10px 25px;
      font-size: 18px;
      border-radius: 20px;
    }
  }

  .image-input-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .image-preview {
    flex-grow: 1;
    max-width: 300px; /* or other desired size */
    height: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  nav {
    background-color: #e3f2fd; /* Light blue background color */
    padding: 2px;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
  }
  li {
    margin-right: 1px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: flex-end;
  }
  button {
    background-color: #ccc;
    border: none;
    color: white;
    padding: 5px 25px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 25px;
    margin: 4px 140px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease;
    font-family: JejuGothic, sans-serif;
  }
  button:hover {
    background-color: #6a27ce;
  }
  @media (max-width: 768px) {
    input,
    button {
      padding: 10px;
      font-size: 14px;
      border-radius: 10px;
    }
  }
  @media (min-width: 769px) {
    button {
      padding: 10px 25px;
      font-size: 18px;
      border-radius: 20px;
    }
  }
</style>
