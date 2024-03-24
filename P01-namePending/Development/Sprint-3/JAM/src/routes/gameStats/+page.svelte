<script>
    import { Chart, LineController, BarController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title} from 'chart.js' 
    import { onMount } from 'svelte';

    export{};
    Chart.register(LineController, BarController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title);

    /* PLAYER STATISTICS */

    //for player, DISPLAY overall game stats : average score, average response time
    let gamePlayerHistory = [
        { name: "Player1", scores: [1, 0, 1, 1, 1], responseTimes: [4, 21, 24, 1, 2]}, //quiz1 - game1
        { name: "Player1", scores: [0, 1, 1, 0, 1], responseTimes: [23, 21, 9, 3, 2]}, //quiz2 - game2
        { name: "Player1", scores: [1, 1, 1, 1, 1, 0, 1, 0, 1, 1], responseTimes:[6, 26, 8, 8, 1, 18, 13, 23, 12, 24]} //quiz3 - game3
    ]


    function calculateAvgPlayer(arr) {

        let sum = arr.reduce((total, current) => total + current, 0);
        let avg = sum/arr.length;

        return avg;
  }

    // extracting the scores and response time arrays from player's game history to calculate their averages 
    let totalPlayerScores = gamePlayerHistory.flatMap(player => player.scores);
    let gameScores = [0, 0, 0];
    
    for (let idx = 0; idx < gamePlayerHistory.length; idx++) {
        gameScores[idx] = gamePlayerHistory[idx].scores.reduce((total, current) => total + current, 0);
    }

    let averagePlayerScore = calculateAvgPlayer(totalPlayerScores);


    let totalPlayerResponseTimes = gamePlayerHistory.flatMap(player => player.responseTimes);
    // console.log(gameScores)

    let gameTimes = [0, 0, 0];
    
    for (let idx = 0; idx < gamePlayerHistory.length; idx++) {
        gameTimes[idx] = gamePlayerHistory[idx].responseTimes.reduce((total, current) => total + current, 0);
    }
    let averagePlayerResponseTime = calculateAvgPlayer(totalPlayerResponseTimes);

    // console.log(gameTimes);


    /* HOST STATISTICS */

    //for host, DISPLAY stats for EACH game: average score, average response time
    //NOTE: each entry in the array is a game, and each game has an array of players
    let gameHostHistory = [
        [
            { name: "Player1", scores: [1, 0, 1, 1, 1], responseTimes: [4, 21, 24, 1, 2]}, //quiz1 - game1
            { name: "Player2", scores: [0, 1, 1, 0, 1], responseTimes: [23, 21, 9, 3, 2]},
            { name: "Player3", scores: [1, 1, 1, 1, 1], responseTimes: [12, 5, 1, 7, 5]},
            { name: "Player4", scores: [0, 0, 1, 1, 0], responseTimes: [12, 21, 15, 5, 2]},
            { name: "Player5", scores: [1, 0, 1, 0, 1], responseTimes: [3, 21, 2, 3, 2]},
        ],
        [
            { name: "Player2", scores: [1, 1, 0, 0, 1], responseTimes:  [21, 19, 10, 7, 21]}, //quiz2 - game2
            { name: "Player1", scores: [0, 1, 1, 0, 1], responseTimes: [2, 2, 5, 21, 4]},
            { name: "Player4", scores: [1, 1, 1, 0, 0], responseTimes: [2, 30, 6, 5, 24]},
            { name: "Player3", scores: [0, 1, 1, 1, 1], responseTimes: [9, 29, 8, 21, 15]},
            { name: "Player5", scores: [1, 1, 1, 0, 1], responseTimes: [28, 28, 10, 16, 3]},
        ],
        [
            { name: "Player3", scores: [1, 1, 1, 1, 1, 0, 1, 0, 1, 1], responseTimes:[6, 26, 8, 8, 1, 18, 13, 23, 12, 24]}, //quiz3 - game3
            { name: "Player1", scores: [1, 1, 0, 0, 1, 1, 1, 1, 1, 0], responseTimes:[16, 23, 22, 15, 4, 5, 18, 10, 9, 1]},
            { name: "Player2", scores: [1, 1, 1, 1, 1, 0, 1, 0, 1, 1], responseTimes:[3, 18, 23, 26, 17, 16, 1, 15, 24, 3]},
            { name: "Player4", scores: [0, 0, 1, 0, 1, 1, 0, 1, 0, 0], responseTimes:[30, 11, 20, 21, 21, 5, 20, 15, 10, 26]},
            { name: "Player5", scores: [1, 1, 1, 0, 1, 1, 0, 0, 1, 1], responseTimes:[15, 29, 24, 11, 24, 2, 2, 17, 8, 20]},
        ],
    ];

    


    // Calculate the mean score for each game in gameHostHistory

    let meanGameScores = gameHostHistory.map(game => {
        let totalScore = 0;
        let totalPlayers = game.length;

        game.forEach(player => {
            // Calculating the total score achieved by the player and adding it to the total score for the game
            let playerTotalScore = player.scores.reduce((sum, score) => sum + score, 0);
            totalScore += playerTotalScore;
        });

        let meanScore = totalScore / totalPlayers;
        return meanScore
    });

    let meanGameResponseTimes = gameHostHistory.map(game => {
        let totalResponseTime = 0;
        let totalPlayers = game.length;

        game.forEach(player => {
            // Calculating the total response time for the player and adding it to the total response time for the game
            let playerTotalResponseTime = player.responseTimes.reduce((sum, time) => sum + time, 0);
            totalResponseTime += playerTotalResponseTime;
        });

        // Calculating the mean response time for the game by dividing the total response time by the number of players
        let meanResponseTime = totalResponseTime / totalPlayers;
        return meanResponseTime;

    });

    
    // -------------------------------------------------GRAPHING-----------------------------------------------------------------//


    let playerScoresChart;
    let playerTimesChart;

    let histograms = [];


    onMount(() => {


        /* GRAPHING PLAYER STATISTICS */

        let gameLabels = [];
        for (let i = 0; i < gamePlayerHistory.length; i++) {
            gameLabels.push(`Game ${i + 1}`);
        }

        let playerScoresCanvas = document.getElementById('playerScoresChart');
        let playerTimesCanvas = document.getElementById('playerTimesChart');

        if (playerScoresCanvas instanceof HTMLCanvasElement && playerTimesCanvas instanceof HTMLCanvasElement) {
            let playerScoresCtx = playerScoresCanvas.getContext('2d');
            let playerTimesCtx = playerTimesCanvas.getContext('2d');

            if (playerScoresCtx && playerTimesCtx) {
                playerScoresChart = new Chart(playerScoresCtx, {
                    type: 'line',
                    data: {
                        labels: gameLabels,
                        datasets: [
                            {
                                label: 'Scores',
                                data: gameScores,
                                borderColor: '#7801a8',
                                borderWidth: 4,
                                fill: false
                            }
                        ]
                    },
                    options: {
                        responsive: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Quiz Scores per Game'
                            }
                        },
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                beginAtZero: true,
                            },
                            x: {
                                type: 'category',
                                display: true,
                                labels: gameLabels,
                            }
                        }
                    }
                });

                playerTimesChart = new Chart(playerTimesCtx, {
                    type: 'line',
                    data: {
                        labels: gameLabels,
                        datasets: [
                            {
                                label: 'Response Times',
                                data: gameTimes,
                                borderColor: '#ca84e5',
                                borderWidth: 4,
                                fill: false
                            }
                        ]
                    },
                    options: {
                        responsive: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Response Times per Game (s)'
                            }
                        },
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                beginAtZero: true,
                            },
                            x: {
                                type: 'category',
                                display: true,
                                labels: gameLabels,
                            }
                        }
                    }
                });
            }
        }

        /* GRAPHING HOST STATISTICS */

        // creating separate histrograms for Scores and Response Times for each Game

        gameHostHistory.forEach((game, index) => {

            let scores = [];
            let responseTimes = [];

            game.forEach(player => {
                scores.push(player.scores.reduce((sum, score) => sum + score, 0));
                responseTimes.push(player.responseTimes.reduce((sum, time) => sum + time, 0));
            });
        
            // calculating the freq of each player's score and RT
            let scoreCounts = {};
            let responseTimeCounts = {};

            scores.forEach(score => scoreCounts[score] = (scoreCounts[score] || 0) + 1);
            responseTimes.forEach(time => responseTimeCounts[time] = (responseTimeCounts[time] || 0) + 1);

            // preparing labels and data for the histograms
            let scoreLabels = Object.keys(scoreCounts);
            let scoreData = Object.values(scoreCounts);

            let responseTimeLabels = Object.keys(responseTimeCounts);
            let responseTimeData = Object.values(responseTimeCounts);

            // creating score histogram
            histograms[index] = new Chart(`hostHistograms${index}`, {
                type: 'bar',
                data: {
                    labels: scoreLabels,
                    datasets: [{
                        label: 'Frequency of Scores',
                        data: scoreData,
                        backgroundColor: '#7801a8'
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `Game ${index + 1} Scores`
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // creating RT histogram
            histograms[index + gameHostHistory.length] = new Chart(`hostHistograms${index + gameHostHistory.length}`, {
                type: 'bar',
                data: {
                    labels: responseTimeLabels,
                    datasets: [{
                        label: 'Frequency of Response Times',
                        data: responseTimeData,
                        backgroundColor: '#ca84e5'
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `Game ${index + 1} Response Times`
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    });
    
</script>

<main>
    <body>
        <div class="container">
        <h2>Player Stats</h2>
        <div class="inside-box">
            <canvas id="playerScoresChart" width="400" height="200"></canvas>
            <canvas id="playerTimesChart" width="400" height="200"></canvas>
            <div class="inside-option">
            <p> {'Name: ' + gamePlayerHistory[0].name}</p>
            <p>Overall Percentage of Correctness: {averagePlayerScore*100 + ' %'}</p>
            <p>Average Response Time per Question: {averagePlayerResponseTime} s</p>
            </div>
        </div>
    
        <h2>Host Stats</h2>
        {#each gameHostHistory as game, i}
            <div class="inside-box">
            <canvas id={"hostHistograms" + i} width="400" height="200"></canvas>
            <canvas id={"hostHistograms" + (i + gameHostHistory.length)} width="400" height="200"></canvas>
            <div class="inside-option">
                <p>Average Score:  {meanGameScores[i]}</p>
                <p>Average Time Taken: {meanGameResponseTimes[i]} seconds</p>
            </div>
            </div>
        {/each}
        </div>
    </body>
  </main>

<style>
    body{
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #7801a8;
    font-family: "Jeju Gothic", sans-serif;

    }
    .container {
    max-width: 800px;
    width: 100%;
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: white;
    font-family: "Jeju Gothic", sans-serif;
}

    .inside-box{
    margin: 0;
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "Jeju Gothic", sans-serif;
    }

    h2 {
    margin: 10px 0;
    font-family: "Jeju Gothic", sans-serif;
    font-size: 1.5rem;
  }


  @media screen and (max-width: 768px) {
    .container {
        padding: 10px;
    }
}

</style>


