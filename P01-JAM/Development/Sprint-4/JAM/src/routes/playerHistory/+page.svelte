<script>
  // @ts-nocheck

  import { writable } from "svelte/store";
  import { gameHistory } from "$lib/dummyGames";
  import { user } from "$lib/userStore.js";
  import { quiz1, quiz2, quiz3, quiz4, quiz5 } from "$lib/dummyQuiz";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // @ts-ignore
  const detailedPlayerHistory = writable([]);
  // @ts-ignore
  let showPlayerHistory = false;
  let playerEmail = $user.email;


  let localPlayerHistory;

  onMount(() => {
    // if ($user.email == null || $user.email == "") {
    //   alert("Must be logged in to view history");
    //   goto("/");
    // }

    localPlayerHistory = JSON.parse(localStorage.getItem("playerGameHistory"));
    if (localPlayerHistory == null) {
      localPlayerHistory = [];
    }

    console.log("localPlayerHistory:", localPlayerHistory);
  });

  //note local history has the format:
  //{email: , username : , gameHistory: [{quiz: quiz, scores: playerScores}]}

  detailedPlayerHistory.set([
  {
    quiz: "Quiz 1",
    details: [
      {
        question: "What is your name?",
        providedAnswer: "Liqa",
        correctAnswer: "Hafsa",
        wasCorrect: true
      },
      {
        question: "Question 2",
        providedAnswer: "Provided Answer 2",
        correctAnswer: "Correct Answer 2",
        wasCorrect: false
      },
      // Add more detail objects as needed
    ]
  },
  {
    quiz: "Quiz 2",
    details: [
      {
        question: "Question 1",
        providedAnswer: "Provided Answer 1",
        correctAnswer: "Correct Answer 1",
        wasCorrect: false
      },
      {
        question: "Question 2",
        providedAnswer: "Provided Answer 2",
        correctAnswer: "Correct Answer 2",
        wasCorrect: true
      },
    ]
  }])

  function togglePlayerHistory(userEmail) {
    showPlayerHistory = !showPlayerHistory;
    if (showPlayerHistory) {

      let playerHistory = [];

      let localGameHistory = localPlayerHistory.find(
        (player) => player.email == userEmail
      );

      if (localGameHistory == null) {
        alert("No history to show");
        showPlayerHistory = !showPlayerHistory;
        return;
      }

      //console.log("localGameHistory:", localGameHistory);
      let games = localGameHistory.gameHistory;
      
      games.forEach((quizHistory, index) => {
        //console.log("QuizHistory: ", quizHistory);
        let playerRecord = quizHistory.scores.find(
          (player) => player.name = userEmail
        );
        let currentQuiz = games[index].quiz.quiz;
        //console.log("currentQuiz:", currentQuiz);
        //console.log("playerRecord:", playerRecord);
        if (playerRecord && currentQuiz) {
          let quizDetails = playerRecord.scores.map((score, questionIndex) => {
            let questionItem = currentQuiz[questionIndex];
            //console.log("questionItem:", questionItem);
            if (questionItem) {
              return {
                question: questionItem.question,
                providedAnswer: questionItem.choices[score],
                correctAnswer: questionItem.answer,
                wasCorrect: score == 1,
              };
            }
            return null;
          });
          //console.log("quizDetails:", quizDetails);
          playerHistory.push({
            quiz: `Quiz ${index + 1}`,
            details: quizDetails.filter((detail) => detail !== null),
          });
        }
      });
      // @ts-ignore
      // detailedPlayerHistory.set(playerHistory);

      // dummy player history 

    const detailedPlayerHistory = [
  {
    quiz: "Quiz 1",
    details: [
      {
        question: "Question 1",
        providedAnswer: "Provided Answer 1",
        correctAnswer: "Correct Answer 1",
        wasCorrect: true
      },
      {
        question: "Question 2",
        providedAnswer: "Provided Answer 2",
        correctAnswer: "Correct Answer 2",
        wasCorrect: false
      },
      // Add more detail objects as needed
    ]
  },
  {
    quiz: "Quiz 2",
    details: [
      {
        question: "Question 1",
        providedAnswer: "Provided Answer 1",
        correctAnswer: "Correct Answer 1",
        wasCorrect: false
      },
      {
        question: "Question 2",
        providedAnswer: "Provided Answer 2",
        correctAnswer: "Correct Answer 2",
        wasCorrect: true
      },
    ]
  }]

}}
 
  function deleteHistory() {
    detailedPlayerHistory.set([]);
    showPlayerHistory = false;

    //delete local storage
    localStorage.removeItem("playerGameHistory");

    //delete local variables
    localHostHistory = [];
  }

  window.onload = function() {
      togglePlayerHistory();};
</script>

<main>
  <body class = "bg-purple-500">

    <div class="bg-purple-900 text-white py-4" >
      <div class="navbar mx-auto px-4 flex justify-between items-center">
  
        <!-- left aligned items -->
        <div>
          <a href = '/viewHistory_' class = "hover:text-white">Back</a>
        </div>
  
        <!-- center -->
        <div class ="ml-12 font-bold text-2xl flex items-center">
          <span>Player History</span>
        </div>     
  
        <!-- right aligned items -->
        <div class = "flex items-center space-x-12">
          <a href = '/' class = "hover:text-white">Home</a>
          <button onclick="logout()" class="hover:text-white">Logout</button>
        </div>
        
      </div>
    </div>
    
    <div class = "mr-12 mt-8 flex flex-col items-center h-screen">
      <!-- {#if showPlayerHistory} -->
        {#each $detailedPlayerHistory as quiz (quiz.quiz)}
        <div class="w-full md:w-1/2 mb-8"> 
          <div class="bg-white p-4 rounded shadow-md">
            <h3 class="text-2xl font-bold mb-12">{quiz.quiz}</h3>
            <ul ol class="list-decimal pl-4">
              {#each quiz.details as detail}
                <li class="mb-6">
                  <span class="font-bold">{detail.question}</span> 
                  
                  <div class="{detail.wasCorrect ? 'bg-green-400' : 'bg-red-400'} p-2 rounded"> 
                    <span class="ml-2">
                      {detail.providedAnswer}
                    </span>
                  </div>
                  <span class="font-bold">Solution: {detail.correctAnswer}</span> 
                </li>
              {/each}
            </ul>
          </div>
        </div>
        {/each}
        <button onclick = "deleteHistory()" class = "bg-red-700 hover:bg-red-500 text-white py-2 px-2 text-lg rounded transition duration-150 ease-in-out">Delete History</button>
      <!-- {/if} -->
    </div>
  </body>
</main>

