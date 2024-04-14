import { quiz1, quiz2, quiz3 } from "./dummyQuiz";

//NOTE THIS IS THE INPUT GIVEN BY SERVER AT THE END OF THE GAME

//score corresponds to the index of the question and if the player got it right

export const gameHistory = [
  [
    { name: "Player1", scores: [1, 0, 1, 1, 1] }, //quiz1
    { name: "Player2", scores: [0, 1, 1, 0, 1] },
    { name: "Player3", scores: [1, 1, 1, 1, 1] },
    { name: "Player4", scores: [0, 0, 1, 1, 0] },
    { name: "Player5", scores: [1, 0, 1, 0, 1] },
  ],
  [
    { name: "Player2", scores: [1, 1, 0, 0, 1] }, //quiz2
    { name: "Player1", scores: [0, 1, 1, 0, 1] },
    { name: "Player4", scores: [1, 1, 1, 0, 0] },
    { name: "Player3", scores: [0, 1, 1, 1, 1] },
    { name: "Player5", scores: [1, 1, 1, 0, 1] },
  ],
  [
    { name: "Player3", scores: [1, 1, 1, 1, 1, 0, 1, 0, 1, 1] }, //quiz3
    { name: "Player1", scores: [1, 1, 0, 0, 1, 1, 1, 1, 1, 0] },
    { name: "Player2", scores: [1, 1, 1, 1, 1, 0, 1, 0, 1, 1] },
    { name: "Player4", scores: [0, 0, 1, 0, 1, 1, 0, 1, 0, 0] },
    { name: "Player5", scores: [1, 1, 1, 0, 1, 1, 0, 0, 1, 1] },
  ],
  [
    { name: "Player1", scores: [1, 1, 0, 0, 1, 1, 1, 0, 1, 1] }, //quiz4
    { name: "Player4", scores: [0, 1, 0, 0, 1, 1, 0, 1, 0, 1] },
    { name: "Player2", scores: [1, 1, 1, 0, 1, 0, 1, 0, 1, 1] },
    { name: "Player5", scores: [1, 1, 1, 1, 1, 1, 1, 0, 1, 1] },
    { name: "Player3", scores: [1, 0, 1, 1, 1, 0, 1, 0, 1, 0] },
  ],
  [
    { name: "Player5", scores: [1, 0, 1, 0, 1, 1, 1, 0, 1, 1] }, //quiz5
    { name: "Player1", scores: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "Player3", scores: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1] },
    { name: "Player2", scores: [0, 1, 1, 0, 1, 0, 1, 1, 0, 1] },
    { name: "Player4", scores: [1, 0, 1, 1, 0, 1, 0, 0, 1, 0] },
  ],
];

export const gameHistHost = [
  {
    email: "example@example.com",
    gameHistory: [
      {
        quiz: {
          title: "General Knowledge",
          type: "4-choices",
          quiz: [
            {
              question: "What is the capital of France?",
              answer: "Paris",
              choices: ["London", "Berlin", "Madrid", "Paris"],
              timeLimit: 30,
            },
            {
              question: "Which planet is known as the Red Planet?",
              answer: "Mars",
              choices: ["Venus", "Mars", "Jupiter", "Saturn"],
              timeLimit: 30,
            },
            {
              question: "What is the largest mammal in the world?",
              answer: "Blue Whale",
              choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
              timeLimit: 30,
            },
            {
              question: "In which year did the Titanic sink?",
              answer: "1912",
              choices: ["1905", "1912", "1923", "1931"],
              timeLimit: 30,
            },
            {
              question: "What is the capital of Japan?",
              answer: "Tokyo",
              choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
              timeLimit: 30,
            },
          ],
          otherDetails: {},
        },
        score: [
          {
            name: "John Doe",
            scores: [1, 1, 0, 1, 0],
            responseTimes: [15, 20, 17, 12, 18],
          },
          {
            name: "Jane Smith",
            scores: [0, 1, 0, 1, 0],
            responseTimes: [17, 15, 19, 13, 16],
          },
        ],
      },
    ],
    type: "host",
  },
  {
    email: "example@example.com",
    gameHistory: [
      {
        quiz: {
          title: "General Knowledge",
          type: "4-choices",
          quiz: [
            {
              question: "What is the capital of France?",
              answer: "Paris",
              choices: ["London", "Berlin", "Madrid", "Paris"],
              timeLimit: 30,
            },
            {
              question: "Which planet is known as the Red Planet?",
              answer: "Mars",
              choices: ["Venus", "Mars", "Jupiter", "Saturn"],
              timeLimit: 30,
            },
            {
              question: "What is the largest mammal in the world?",
              answer: "Blue Whale",
              choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
              timeLimit: 30,
            },
            {
              question: "In which year did the Titanic sink?",
              answer: "1912",
              choices: ["1905", "1912", "1923", "1931"],
              timeLimit: 30,
            },
            {
              question: "What is the capital of Japan?",
              answer: "Tokyo",
              choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
              timeLimit: 30,
            },
          ],
          otherDetails: {},
        },
        score: [
          {
            name: "John Jolly",
            scores: [0, 1, 0, 1, 0],
            responseTimes: [15, 20, 17, 12, 18],
          },
          {
            name: "Jane Zoe",
            scores: [1, 1, 1, 1, 0],
            responseTimes: [17, 15, 19, 13, 16],
          },
        ],
      },
    ],
    type: "host",
  },
  {
    email: "example@example.com",
    gameHistory: [
      {
        quiz: {
          title: "General Knowledge",
          type: "4-choices",
          quiz: [
            {
              question: "What is the capital of France?",
              answer: "Paris",
              choices: ["London", "Berlin", "Madrid", "Paris"],
              timeLimit: 30,
            },
            {
              question: "Which planet is known as the Red Planet?",
              answer: "Mars",
              choices: ["Venus", "Mars", "Jupiter", "Saturn"],
              timeLimit: 30,
            },
            {
              question: "What is the largest mammal in the world?",
              answer: "Blue Whale",
              choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
              timeLimit: 30,
            },
            {
              question: "In which year did the Titanic sink?",
              answer: "1912",
              choices: ["1905", "1912", "1923", "1931"],
              timeLimit: 30,
            },
            {
              question: "What is the capital of Japan?",
              answer: "Tokyo",
              choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
              timeLimit: 30,
            },
          ],
          otherDetails: {},
        },
        score: [
          {
            name: "Adam Doe",
            scores: [1, 1, 1, 1, 1],
            responseTimes: [15, 20, 17, 12, 18],
          },
          {
            name: "Jimmy Smith",
            scores: [0, 1, 0, 0, 0],
            responseTimes: [17, 15, 19, 13, 16],
          },
        ],
      },
    ],
    type: "host",
  },
];

export const gameHistPlayer = [
  {
    email: "example@example.com",
    gameHistory: [
      {
        quiz: {
          title: "General Knowledge",
          type: "4-choices",
          quiz: [
            {
              question: "What is the capital of France?",
              answer: "Paris",
              choices: ["London", "Berlin", "Madrid", "Paris"],
              timeLimit: 30,
            },
            {
              question: "Which planet is known as the Red Planet?",
              answer: "Mars",
              choices: ["Venus", "Mars", "Jupiter", "Saturn"],
              timeLimit: 30,
            },
            {
              question: "What is the largest mammal in the world?",
              answer: "Blue Whale",
              choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
              timeLimit: 30,
            },
            {
              question: "In which year did the Titanic sink?",
              answer: "1912",
              choices: ["1905", "1912", "1923", "1931"],
              timeLimit: 30,
            },
            {
              question: "What is the capital of Japan?",
              answer: "Tokyo",
              choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
              timeLimit: 30,
            },
          ],
          otherDetails: {},
        },
        score: [
          {
            name: "John Doe",
            scores: [1, 1, 0, 1, 0],
            responseTimes: [15, 20, 17, 12, 18],
          },
          {
            name: "example@example.com",
            scores: [0, 1, 0, 1, 0],
            responseTimes: [17, 15, 19, 13, 16],
          },
        ],
      },
    ],
    type: "player",
  },
  {
    email: "example@example.com",
    gameHistory: [
      {
        quiz: {
          title: "General Knowledge",
          type: "4-choices",
          quiz: [
            {
              question: "What is the capital of France?",
              answer: "Paris",
              choices: ["London", "Berlin", "Madrid", "Paris"],
              timeLimit: 30,
            },
            {
              question: "Which planet is known as the Red Planet?",
              answer: "Mars",
              choices: ["Venus", "Mars", "Jupiter", "Saturn"],
              timeLimit: 30,
            },
            {
              question: "What is the largest mammal in the world?",
              answer: "Blue Whale",
              choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
              timeLimit: 30,
            },
            {
              question: "In which year did the Titanic sink?",
              answer: "1912",
              choices: ["1905", "1912", "1923", "1931"],
              timeLimit: 30,
            },
            {
              question: "What is the capital of Japan?",
              answer: "Tokyo",
              choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
              timeLimit: 30,
            },
          ],
          otherDetails: {},
        },
        score: [
          {
            name: "John Jolly",
            scores: [0, 1, 0, 1, 0],
            responseTimes: [15, 20, 17, 12, 18],
          },
          {
            name: "example@example.com",
            scores: [1, 1, 1, 1, 0],
            responseTimes: [17, 15, 19, 13, 16],
          },
        ],
      },
    ],
    type: "player",
  },
  {
    email: "example@example.com",
    gameHistory: [
      {
        quiz: {
          title: "General Knowledge",
          type: "4-choices",
          quiz: [
            {
              question: "What is the capital of France?",
              answer: "Paris",
              choices: ["London", "Berlin", "Madrid", "Paris"],
              timeLimit: 30,
            },
            {
              question: "Which planet is known as the Red Planet?",
              answer: "Mars",
              choices: ["Venus", "Mars", "Jupiter", "Saturn"],
              timeLimit: 30,
            },
            {
              question: "What is the largest mammal in the world?",
              answer: "Blue Whale",
              choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
              timeLimit: 30,
            },
            {
              question: "In which year did the Titanic sink?",
              answer: "1912",
              choices: ["1905", "1912", "1923", "1931"],
              timeLimit: 30,
            },
            {
              question: "What is the capital of Japan?",
              answer: "Tokyo",
              choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
              timeLimit: 30,
            },
          ],
          otherDetails: {},
        },
        score: [
          {
            name: "Adam Doe",
            scores: [1, 1, 1, 1, 1],
            responseTimes: [15, 20, 17, 12, 18],
          },
          {
            name: "example@example.com",
            scores: [0, 1, 0, 0, 0],
            responseTimes: [17, 15, 19, 13, 16],
          },
        ],
      },
    ],
    type: "player",
  },
];
