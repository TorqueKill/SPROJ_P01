// @ts-nocheck
import {
  saveQuiz,
  getQuiz,
  saveHistory,
  getHistory,
  updateQuiz,
} from "../API/gameAPI.js";

import { gameHistHost, gameHistPlayer } from "../dummyGames.js";

//testing getHistory, saveHistory
let email = "123@gmail.com";

let page = 0;
let pagesize = 13;

//getHistory

function testGetHistory(email, page, pagesize, type) {
  console.log("Testing getHistory");
  getHistory(email, page, pagesize, type)
    .then((response) => {
      //console.log("History retrieved successfully", response);
    })
    .catch((error) => {
      console.error("Error retrieving history", error);
    });
}

let playerOrHost = "player";

let email2 = "example@example.com";
let gameHistory_ =
  playerOrHost === "host" ? gameHistHost[0] : gameHistPlayer[0];
let type = playerOrHost === "host" ? "host" : "player";

//saveHistory
function testSaveHistory(email, gameHistory, type) {
  console.log("Testing saveHistory");
  saveHistory(email, gameHistory.gameHistory, type)
    .then((response) => {
      //console.log("History saved successfully", response);
    })
    .catch((error) => {
      console.error("Error saving history", error);
    });
}

//testSaveHistory(email2, gameHistory_, type);
testGetHistory(email2, page, pagesize, type);
