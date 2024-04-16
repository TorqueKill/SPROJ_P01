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

  function quizWrapper(quiz) {
    let title = "Quiz";
    let type = "4-choices";
    let otherDetails = {};

    let quizObj = {
      title: title,
      type: type,
      quiz: quiz,
      otherDetails: otherDetails,
    };

    return quizObj;
  }

  function increaseTime(questionIndex) {
    if (quiz1[questionIndex].timeLimit < MAX_TIME_LIMIT) {
      quiz1[questionIndex].timeLimit += 5;
    }
  }

  function saveQuiz() {
    let saveingQuiz = quiz1;
    populateIfBlank(saveingQuiz);
    let quizObj = quizWrapper(saveingQuiz);
    console.log(quizObj);
    localStorage.setItem("Quiz", JSON.stringify([quizObj]));
    // goto("/createRoom");
    $user.hostQuiz = quizObj;
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

<!-- <nav
  class="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 p-4 fixed top-0 w-full z-50 shadow-lg font-garamond"
>
  <div class="logo">JAM</div>
  <ul>
    <li><button class="nav_button" on:click={() => goto("/")}>Home</button></li>
    <li>
      <button class="nav_button" on:click={() => goto("/viewHistory")}
        >History</button
      >
    </li>
    {#if $user.isHost}
       Show Host Settings button only if the user is a host -->
<!-- <li> -->
<!-- <button class="nav_button" on:click={openHostSettingsModal}
          >Host Settings</button
        >
      </li>
    {/if}
    <li><button class="nav_button" on:click={logout}>Logout</button></li>
  </ul>
</nav> -->

<nav
  class="flex justify-center items-center space-x-2 overflow-auto py-4 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 fixed top-0 w-full z-20 shadow-lg font-garamond text-s"
>
  <div class="container mx-auto flex justify-between items-center">
    <div class="text-2xl font-bold text-white">JAM</div>
    <ul class="flex space-x-4">
      <li>
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          on:click={() => goto("/viewHistory")}
        >
          History
        </button>
      </li>
      {#if $user.isHost}
        <li>
          <button
            class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            on:click={openHostSettingsModal}>Host Settings</button
          >
        </li>
      {/if}
      <li>
        <button
          class="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          on:click={logout}
        >
          Logout
        </button>
      </li>
    </ul>
  </div>
</nav>

<main
  class="flex flex-col lg:flex-row bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 text-white min-h-screen pt-16 font-garamond"
>
  <!-- Sidebar with questions list -->
  <aside
    class="bg-black bg-opacity-80 p-4 rounded-lg shadow-xl w-full lg:w-1/5"
  >
    {#each quiz1 as question, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="cursor-pointer p-4 mb-2 bg-purple-700 rounded hover:bg-purple-800 transition duration-300 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105 shadow-lg"
        on:click={() => selectQuestion(index)}
      >
        Question {index + 1}
      </div>
    {/each}
    <button
      class="w-full bg-gradient-to-r from-purple-400 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg mt-4"
      on:click={addQuestion}
    >
      Add Question
    </button>
  </aside>

  <!-- Main content area -->
  <section class="flex-grow p-8 overflow-auto">
    {#if quiz1.length > 0}
      <div class="space-y-6">
        <div>
          <label
            class="block text-sm font-medium mb-2"
            for={`question-${selectedQuestionIndex}`}
          >
            Question {selectedQuestionIndex + 1}
          </label>
          <input
            type="text"
            id={`question-${selectedQuestionIndex}`}
            class="w-full p-2 rounded text-black"
            placeholder="Type your question here"
            bind:value={quiz1[selectedQuestionIndex].question}
            on:input={(event) =>
              updateQuestionText(selectedQuestionIndex, event)}
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each quiz1[selectedQuestionIndex].choices as choice, oIndex}
            <label class="flex items-center space-x-2">
              <input
                type="text"
                class="p-2 rounded text-black flex-1"
                placeholder="Enter option"
                bind:value={choice}
                on:input={(event) =>
                  updateOptionText(selectedQuestionIndex, oIndex, event)}
              />
              <input
                type="radio"
                bind:group={quiz1[selectedQuestionIndex].answer}
                value={choice}
                on:change={() => updateAnswer(selectedQuestionIndex, choice)}
              />
            </label>
          {/each}
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-2"
            for={`image-url-${selectedQuestionIndex}`}
          >
            Image URL (optional)
          </label>
          <input
            type="text"
            id={`image-url-${selectedQuestionIndex}`}
            class="w-full p-2 rounded text-black"
            placeholder="Enter image URL"
            bind:value={quiz1[selectedQuestionIndex].imageUrl}
            on:input={(event) => updateImageUrl(selectedQuestionIndex, event)}
          />
          {#if quiz1[selectedQuestionIndex].imageUrl}
            <img
              src={quiz1[selectedQuestionIndex].imageUrl}
              class="mt-4 rounded max-w-xs mx-auto"
              alt={`Image for Question ${selectedQuestionIndex + 1}`}
            />
          {/if}
        </div>

        <button
          class=" bg-gradient-to-r from-purple-400 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          on:click={() => increaseTime(selectedQuestionIndex)}
        >
          Time limit: {quiz1[selectedQuestionIndex].timeLimit} seconds
        </button>
      </div>
    {/if}
  </section>

  <!-- Sidebar with action buttons -->
  <aside
    class="bg-black bg-opacity-80 p-4 rounded-lg shadow-xl w-full lg:w-1/5 mt-4 lg:mt-0"
  >
    <button
      class="w-full bg-gradient-to-r from-purple-400 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
      on:click={() => saveQuiz()}
    >
      Save/Choose
    </button>
    {#if isQuizSelected}
      <button
        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg mt-4"
        on:click={() => goto("/createRoom")}
      >
        Proceed
      </button>
    {/if}
    <button
      class="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg mt-4"
      on:click={() => goto("/hostOrPlayer")}
    >
      Back
    </button>
  </aside>
</main>
