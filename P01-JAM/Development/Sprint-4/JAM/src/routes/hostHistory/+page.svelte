<script>
    // @ts-nocheck
  
    import { writable } from "svelte/store";
    import { gameHistory, gameHistHost } from "$lib/dummyGames";
    import { user } from "$lib/userStore.js";
    import { quiz1, quiz2, quiz3, quiz4, quiz5 } from "$lib/dummyQuiz";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
  
   
    // @ts-ignore

    const DUMMY_EMAIL = "example@example.com"

    const hostHistory = writable([]);
    let showHostHistory = true;
    let playerEmail = DUMMY_EMAIL
  

    let localHostHistory;
  
  
    onMount(() => {
  
     
      localHostHistory = JSON.parse(localStorage.getItem("hostGameHistory"));
      if (localHostHistory == null) {
        localHostHistory = [];
      }

      if (localHostHistory.length == 0) {
        localHostHistory = gameHistHost;
      }
  
      console.log("localHostHistory:", localHostHistory);
  
    });

    const logout = async () => {
    try {
        // Call the logout method from your authentication service
        //await authService.logout();

        // Redirect to the login page or any other desired page after logout
        goto('/signIn');
    } catch (error) {
        console.error('Logout failed:', error);
    }
    };
  
    //note local history has the format:
    //{email: , username : , gameHistory: [{quiz: quiz, scores: playerScores}]}
  
    // dummy host history variable
    // hostHistory.set([
    // {
    //     quiz: "Quiz 1",
    //     players: [
    //     { name: "Player 1", score: "2/5" },
    //     { name: "Player 2", score: "3/5" },
    //     ],
    // },
    // {
    //     quiz: "Quiz 2",
    //     players: [
    //     { name: "Player 1", score: "4/5" },
    //     { name: "Player 2", score: "2/5" },
    //     ],
    // },
    // ]);

    function toggleHostHistory() {
      showHostHistory = !showHostHistory;
      if (showHostHistory) {
        let history = [];
  
        let localGameHistory = localHostHistory.find(
          (host) => host.email == $user.email
        );
  
        if (localGameHistory == null) {
          alert("No history to show");
          showHostHistory = !showHostHistory;
          return;
        }
  
        let games = localGameHistory.gameHistory;
  
        games.forEach((quizHistory, quizIndex) => {
          let quizResults = {
            quiz: `Quiz ${quizIndex + 1}`,
            players: quizHistory.scores.map((player) => ({
              name: player.name,
              score: `${player.scores.filter((score) => score === 1).length}/${
                player.scores.length
              }`,
            })),
          };
          history.push(quizResults);
        });
        // @ts-ignore
        hostHistory.set(history);
      } else {
        hostHistory.set([]);
      }
    }
  
    function deleteHistory() {
      hostHistory.set([]);
      showHostHistory = false;
  
      //delete local storage
      localStorage.removeItem("hostGameHistory");
  
      //delete local variables
      localHostHistory = [];
    }

    window.onload = function() {
      toggleHostHistory();};
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
                <span>Host History</span>
            </div>     
        
            <!-- right aligned items -->
            <div class = "flex items-center space-x-12">
                <a href = '/' class = "hover:text-white">Home</a>
                <button onclick={logout} class="hover:text-white">Logout</button>
            </div>
            </div>
        </div>

        <div class = "mr-12 mt-8 flex flex-col items-center h-screen">
            {#if showHostHistory}
            <div class="flex flex-wrap">
                {#each $hostHistory as quiz}
                <div class="w-full md:w-1/2 mb-8 px-4"> 
                    <div class="bg-purple-100 p-4 rounded shadow-md">
                    <h3 class="text-2xl font-bold mb-6">{quiz.quiz}</h3>
                        <div class="mt-8">
                        {#each quiz.players as player}
                            <div class = "mb-6">
                                {player.name}: {player.score}</div>
                        {/each}
                        </div>
                    </div>
                </div>
                {/each}
            </div>
            <button onclick = {deleteHistory} class = "bg-red-700 hover:bg-red-500 text-white py-2 px-2 text-lg rounded transition duration-150 ease-in-out">Delete History</button>
            {/if}
        </div>
    </body>
  </main>
  
  