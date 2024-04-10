<script>
    //@ts-nocheck

    import {AVATARS} from "$lib/config.js"

    let quiz =   {
    title: "General Knowledge 2",
    type: "4-choices",
    quiz: [
      {
        question: "What is the capital of France?",
        answer: "Paris",
        choices: ["London", "Berlin", "Madrid", "Paris"],
        timeLimit: 30,
        imageUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAFVBMVEX///8AJlTOESYAGU16gpXefILNABnwlnA6AAAA/klEQVR4nO3QSQ0AIAADsHH6l4yKPUhaCc2oWTs9586aOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHixIkTJ06cOHHy4ckD5KrN4eD2boIAAAAASUVORK5CYII=",
      },
      {
        question: "Which planet is known as the Red Planet?",
        answer: "Mars",
        choices: ["Venus", "Mars", "Jupiter", "Saturn"],
        timeLimit: 30,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ4paDCuvG4_ZbA72mjCZ12kimoHvY_ai5bA&s",
      },
      {
        question: "What is the largest mammal in the world?",
        answer: "Blue Whale",
        choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        timeLimit: 30,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO_wHdYhvj8a7zMl2Im2nuaLgEg6RvfznBSRut6rZ44A&s",
      },
      {
        question: "In which year did the Titanic sink?",
        answer: "1912",
        choices: ["1905", "1912", "1923", "1931"],
        timeLimit: 30,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-gd_aS0fr0b-CCmnDv37yHI9bgjY3iKkmDQ&s",
      },
      {
        question: "What is the capital of Japan?",
        answer: "Tokyo",
        choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
        timeLimit: 30,
        imageUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAflBMVEX///+8AC23AAC7ACe7ACm4ABW5ABu4ABC6ACO5ABm7ACi4ABO6ACL46u3sx83NYXG3AAfnvcL14OTiqLH78fPKVGbEOE/9+PnGQFbjrbX35OjnuL/x09jsxszpv8XfoarSc4HXhZHAHj3CK0bbkJvQanm/DzbUeYbemqS/FjiKuKh1AAADpUlEQVR4nO3diXaiMBSA4QJCUFxwQ63WurTavv8LDtSZozZxipiQE/p/D+Dh3hOTS8jy9AQAAAAAAAAAAAAAAAAAAAqT3uplPRwO1y+r3sT2w1g3679usiBMRRIWEpGGQbZ57f/WzMz6272fRN1Oy7vU6nSjxN9v+zPbD1i74aAtutfZuMpMV7QHS9sPWafVMUnim/n4Jw6Tzcr2o9ZkPfe7PybkpOtna9uPW4PlTgQlM1IIxK7pf6H+TtzuRNRaYte3/dgG9ab+vRn5yoo/7dl+dFM+xM8dq1qcfth+eCN6WVIxI4Uka2BTWST3dK2yQCxsh6DbMX0oI4V0YzsIrWbz9sMp8bx21qB6v/dZtkj7v/izMZ3KKHqsKzkLopHtYPQYJVWKErWWaERSRqG+lORJCRuQlF6kMyV5UiLn+5SZ19GaEi//PddHn6xqOX9bnNkO6jHvkfaUeF70bjusRywer15V0rHtwKp79o2kxPP8Z9uhVbbXVat9F+xth1bVW2goJZ4XvtkOrhpj/5yC72bpNjf1zykEc9vhVbEUBlPiecLF6XxPb03/XetgO8D7jc11sCehe0VKbLaZ5A0lth3ivRamm0neUFybtN6ZbiZ5Q9nZDvI+fTMvOtdSt76ZDvRPEcjige0w7zGpo5nkDcWlNV5jHZ9zftZ2aTg2WtafuVTgT0y+/V3y3fnzLM0XJyehOy8973WMOoXYnZlZw69/Zy3PdqhlPdczEhdSVyZma+tOHOpQtnpWVpTR3doOtqRpPdVJIZ7aDrakQ11drEOzbXVVbAXfdrDl1DjsODPwrMxO2F8TbuzcWNc3FOeDsRv7Nhb1TBSctN2YlK1p8uRvTtyYQhmbWIdzS0ROyEmDckJ/ImHckVGfyKhjZbzvKPBeLGP+RMY8m4z5WBnz9jK+7yjwHVDG92IZ6wpkrD9RYJ2SjPVsMtY9KrA+VsY6agXW28vYl6HA/h0Z+7wUDM+2OTPDdsnwvtHUnVedC+wvlpndh+7MZNI1zitQ4FwLGeefKJg6J8e5CvbSxsh5ShvbYT2Gc7dks4PufrZzcP18Ns7xU+G8RwWt54ImjUgJ58cqcc6wAudRq+g4t/xoOwjdlnddHSILnDx87Afcg6DywH0Zopn3ZTxxr4oa9++ocE+TCvd5qayOYbl7345u7LrQ5Ot+wNtH33d+3f2AJ8U9kuLmPZIvzarjy7t13+hvzccZ99ICAAAAAAAAAAAAAAAAACD7A+PaSTdtOrdEAAAAAElFTkSuQmCC",
      },
    ],
    otherDetails: {},
    }
    
    //these will given by the server on the 'scoreboard' event 
    let dummyPlayers = [
        {
            name: "Sawyer",
            scores: [1, 1, 1, 1, 1, 0, 1, 0, 0, 0],
            responseTimes: [6, 22, 29, 30, 44, 50, 53, 56, 93, 97],
            avatarIndex: 0,
        },
        {
            name: "Reese",
            scores: [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
            responseTimes: [4, 7, 13, 42, 50, 52, 57, 62, 78, 93],
            avatarIndex: 1,
        },
        {
            name: "Taylor",
            scores: [0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
            responseTimes: [3, 5, 12, 21, 38, 39, 40, 45, 79, 81],
            avatarIndex: 2,
        },
        {
            name: "Robin",
            scores: [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
            responseTimes: [1, 3, 7, 13, 27, 28, 29, 44, 58, 99],
            avatarIndex: 3,
        },
        {
            name: "Emerson",
            scores: [0, 1, 1, 1, 1, 0, 1, 1, 0, 0],
            responseTimes: [1, 22, 23, 33, 50, 66, 91, 92, 96, 97],
            avatarIndex: 4,
        },
        {
            name: "Quinn",
            scores: [0, 1, 1, 1, 1, 0, 1, 0, 1, 1],
            responseTimes: [1, 8, 48, 58, 67, 72, 73, 90, 91, 93],
            avatarIndex: 5,
        },
    ];


    let currentQuestion = -1; // -1 means no question is being displayed
    let scoreDisplayCheck = false;
    let isHost = true;
    let showQuestionOnPlayerDisplay = false;
    let playerDisplay = false;
    let isQuestionTitleVisible = false;
    let timerWidth = 100;
    let answerSubmitted;
    let isAsnwerSubmitted = false;
    let questionTimerWidth = 100;
    let scoreDisplayTimerWidth = 100;
    let questionTimeOut = false;

    let flashTitleInterval;
    let questionTimeoutInterval;
    let scoreDisplayInterval;


    const timerDuration = 30;
    const scoreDisplayDuration = 5;
    const questionTitleFlashDuration = 5;
    const LEADERBOARD_SIZE = 5;


    const calculateScore =(scores) => {
        let scoreList = [];
        for (let i = 0; i < scores.length; i++) {
        let score = 0;
        for (let j = 0; j < scores[i].scores.length; j++) {
            //make sure to convert the responseTimes to integer from float
            score += scores[i].scores[j] * Math.floor(scores[i].responseTimes[j]);
        }
        scoreList.push({name: scores[i].name, scores: score, avatarIndex: scores[i].avatarIndex});
        }
        //sort the list by score
        scoreList.sort((a, b) => b.scores - a.scores);
        
        //check if the list is greater than the leaderboard size
        if (scoreList.length > LEADERBOARD_SIZE) {
            scoreList = scoreList.slice(0, LEADERBOARD_SIZE);
        }
        return scoreList;
    }

    function displayHost() {
        isHost = true;
        scoreDisplayCheck = false;
        playerDisplay = false;
    }

    function displayPlayer() {
        isHost = false;
        scoreDisplayCheck = false;
        playerDisplay = true;
    }

    function displayScore() {
        //dev mode check
        if(currentQuestion === -1) currentQuestion = 0;

        isHost = false;
        scoreDisplayCheck = true;
        playerDisplay = false;
        showScore();
    }

    function showQuestion() {
        isQuestionTitleVisible = true;
        timerWidth = 100; // Reset timer
        let duration = questionTitleFlashDuration || 0; // Get the question's time limit
        let elapsed = 0;

        flashTitleInterval = setInterval(() => {
            elapsed++;
            timerWidth = ((duration - elapsed) / duration) * 100;

            if (elapsed >= duration) {
                clearInterval(flashTitleInterval);
                isQuestionTitleVisible = false; // Hide the question after the duration
                // Proceed to the next action after the question is hidden
                questionTimeoutRoutine();
            }
        }, 1000); // Update every second
    }

    function showScore() {
        scoreDisplayCheck = true;
        scoreDisplayTimerWidth = 100; // Reset timer
        let duration = scoreDisplayDuration || 0; // Get the question's time limit
        let elapsed = 0;

        clearInterval(scoreDisplayInterval);
        clearInterval(questionTimeoutInterval);
        clearInterval(flashTitleInterval);

        scoreDisplayInterval = setInterval(() => {
            elapsed++;
            scoreDisplayTimerWidth = ((duration - elapsed) / duration) * 100;

            if (elapsed >= duration) {
                clearInterval(scoreDisplayInterval);
                scoreDisplayCheck = false; // Hide the question after the duration
                // Proceed to the next action after the question is hidden
                displayHost();
                showQuestion();
            }
        }, 1000); // Update every second
    }

    function questionTimeoutRoutine() {
        questionTimeOut = false;
        questionTimerWidth = 100; // Reset timer
        let duration = quiz.quiz[currentQuestion].timeLimit || 0; // Get the question's time limit
        let elapsed = 0;

        questionTimeoutInterval = setInterval(() => {
            elapsed++;
            questionTimerWidth = ((duration - elapsed) / duration) * 100;

            if (elapsed >= duration) {
                clearInterval(questionTimeoutInterval);
                questionTimeOut = true;
                // Proceed to the next action after the question is hidden
            }
        }, 1000); // Update every second
    }

    function nextQuestion() {
        currentQuestion = (currentQuestion + 1) % quiz.quiz.length;
        //clear the previous interval
        clearInterval(flashTitleInterval);
        clearInterval(questionTimeoutInterval);
        clearInterval(scoreDisplayInterval);

        answerSubmitted = '';
        isAsnwerSubmitted = false;

        showQuestion();
    }

    function handleAnswer(answer) {
        if (isAsnwerSubmitted) return;
        isAsnwerSubmitted = true;
        answerSubmitted = answer;
        clearInterval(questionTimeoutInterval);
        // Send the answer to the server
    }

</script>

<!--uses tailwind css for all below-->

<!--Dev command pannel (not included in final build) to test page-->
<!--Dev panel: increment current question, score display event, is Host-->


<div class="flex justify-center space-x-4">
    <button on:click={() => {nextQuestion()}}>Next Question</button>
    <button on:click={() => {displayScore()}}>Show Score</button>
    <button on:click={() => {displayHost()}}>Host</button>
    <button on:click={() => {displayPlayer()}}>Player</button>
    <button on:click={() => {showQuestionOnPlayerDisplay = !showQuestionOnPlayerDisplay}}>Toggle Question Display</button>
</div>

<!--Game session page-->
<div class="min-h-screen bg-purple-800 text-white flex justify-center items-center">
    <!-- Question Title Flash -->
    {#if isQuestionTitleVisible}
        <div class="flex flex-col items-center w-full px-4 py-8">
            <div class="bg-indigo-900 p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <h2 class="text-3xl font-bold mb-4 text-center">{quiz.quiz[currentQuestion].question}</h2>
                <div class="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden mb-2 mt-2">
                    <div class="bg-green-500 h-full" style="transition: width 0.5s ease; width: {timerWidth}%"></div>
                </div>
            </div>
        </div>
    {:else}
        <!-- Host Display -->
        {#if isHost}
            <div class="container mx-auto p-4 max-w-4xl">
                <div class="flex flex-col items-center space-y-8 w-full max-w-4xl">
                    {#if currentQuestion >= 0}
                        <div class="bg-purple-900 p-6 rounded-lg shadow-lg w-full">
                            <h2 class="text-3xl font-bold mb-4 text-center">{quiz.quiz[currentQuestion].question}</h2>
                            {#if quiz.quiz[currentQuestion].imageUrl}
                                <img src={quiz.quiz[currentQuestion].imageUrl} alt="img" class="mx-auto h-auto rounded-md mb-4" />
                            {/if}
                            <!-- Choices (Display only) GRID -->
                            <div class="grid grid-cols-2 gap-4">
                                {#each quiz.quiz[currentQuestion].choices as choice}
                                    <div class="bg-purple-700 p-4 rounded-lg">{choice}</div>
                                {/each}
                            </div>


                            <div class="flex justify-around mt-10">
                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
                                    Pause Timer
                                </button>
                                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded">
                                    Leave Room
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Player Display -->
        {#if playerDisplay && !isHost}
            <div class="container mx-auto p-4 max-w-4xl">
                <div class="flex flex-col items-center space-y-4">
                    {#if currentQuestion >= 0}
                        <div class="bg-purple-900 p-6 rounded-lg shadow-lg max-w-2xl w-full">
                            {#if showQuestionOnPlayerDisplay}
                                <h2 class="text-2xl font-bold mb-4 text-center">{quiz.quiz[currentQuestion].question}</h2>
                                {#if quiz.quiz[currentQuestion].imageUrl}
                                    <img src={quiz.quiz[currentQuestion].imageUrl} alt="img" class="mx-auto h-auto rounded-md mb-4" />
                                {/if}
                            {/if}
                            <div class="space-y-2 mt-4">
                                {#each quiz.quiz[currentQuestion].choices as choice}
                                    <button class="text-left w-full bg-purple-700 hover:bg-purple-600 rounded p-3" on:click={() => handleAnswer(choice)}>
                                        {choice}
                                    </button>
                                {/each}
                            </div>
                            <div class="w-full bg-purple-700 rounded-full h-2.5 dark:bg-purple-700 overflow-hidden mb-2 mt-2">
                                <div class="bg-green-500 h-full" style="transition: width 0.5s ease; width: {questionTimerWidth}%"></div>
                            </div>
                            {#if !questionTimeOut} <!-- condition for timeout -->
                                <div class="mt-4 {isAsnwerSubmitted ? "bg-indigo-500" :"bg-purple-700" }  p-3 rounded text-center">
                                    {isAsnwerSubmitted ? answerSubmitted : 'Select an Answer'}
                                </div>
                            {:else}
                                <div class="mt-4 bg-red-500 p-3 rounded text-center">
                                    Time Out!
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Score Display -->
        {#if scoreDisplayCheck}
            <div class="container mx-auto p-4 max-w-4xl">
                <div class=" bg-purple-900 p-8 rounded-lg shadow-lg max-w-4xl">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-300">Leaderboard</h3>
                    <div class="space-y-4">
                        {#each calculateScore(dummyPlayers) as player, index}
                        <div class="flex items-center justify-between bg-purple-800 p-4 rounded-lg">
                            <div class="flex items-center">
                                <img src={`/avatars/${AVATARS[player.avatarIndex]}`} alt="avatar" class="w-12 h-12 rounded-full mr-4">
                                <div class="text-lg font-medium {index < 3 ? 'text-yellow-400' : 'text-gray-300'}">{player.name}</div>
                            </div>
                            <div class="text-lg font-bold {index < 3 ? 'text-white' : 'text-gray-400'}">{player.scores} points</div>
                        </div>
                        {/each}
                    </div>
                    <div class="w-full bg-purple-700 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden mb-2 mt-2">
                        <div class="bg-green-500 h-full" style="transition: width 0.5s ease; width: {scoreDisplayTimerWidth}%"></div>
                    </div>
                </div>
            </div>
        {/if}
        
    {/if}
</div>
