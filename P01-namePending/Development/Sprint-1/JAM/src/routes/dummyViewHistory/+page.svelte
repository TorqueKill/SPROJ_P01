
<script>
    import { gameHistory } from "$lib/dummyGames";
    import { quiz1, quiz2, quiz3 } from "$lib/dummyQuiz";

    //goto game history and see what quiz cooresponds to what game
    //display all the games on host and player side
    
    //player should be able to only look at their own history in detail ie question "what is 2+2" answer "4" score "1/1"
    //host should be able to look at all the history as scores ie. player1: 5/10, player2: 7/10 and the quiz that was used

    //host can choose to edit the quiz and then save it as a new quiz
    //both host and player can choose to delete the game history

    let playerUsername = "player1"; //should be able to change this to any player

</script>



<h1>
    Dummy View History
</h1>

<button>view player history</button>
<button>view host history</button>