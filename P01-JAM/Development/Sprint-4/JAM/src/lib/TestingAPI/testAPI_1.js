// @ts-nocheck
import {
  saveQuiz,
  getQuiz,
  saveHistory,
  getHistory,
  updateQuiz,
} from "../API/gameAPI.js";
import { quiz1, quiz2, quiz3 } from "../dummyQuiz2.js";

//testingAPI, call and test the functions

//saveQuiz
let email = "test1@dev";
let quiz = quiz3;

let page = 0;
let pagesize = 13;

function testSaveQuiz(email, quiz) {
  console.log("Testing saveQuiz");
  saveQuiz(email, quiz)
    .then((response) => {
      console.log("Quiz saved successfully", response);
    })
    .catch((error) => {
      console.error("Error saving quiz", error);
    });
}

function extractQuizzes(quizzesArray) {
  return quizzesArray.map((quizItem) => quizItem.quiz);
}

function testGetQuiz(email, page, pagesize) {
  console.log("Testing getQuiz");
  getQuiz(email, page, pagesize)
    .then((response) => {
      //console.log("Quiz retrieved successfully", response);
      let quizzes = extractQuizzes(response.quizzes);
      console.log("Quizzes", quizzes);
      console.log("Total quizzes", response.total);
      console.log(quizzes[0]);
      quizzes[0].title = "Updated title";
      console.log(quizzes[0]);
      updateQuiz(email, quizzes[0], quizzes[0]._id).then((response) => {
        console.log("Quiz updated successfully", response);
      });
    })
    .catch((error) => {
      console.error("Error retrieving quiz", error);
    });
}

function testUpateQuiz(email, quiz, id) {
  console.log("Testing updateQuiz");
  updateQuiz(email, quiz, id)
    .then((response) => {
      console.log("Quiz updated successfully", response);
    })
    .catch((error) => {
      console.error("Error updating quiz", error);
    });
}

//testSaveQuiz(email, quiz);
testGetQuiz(email, page, pagesize);
