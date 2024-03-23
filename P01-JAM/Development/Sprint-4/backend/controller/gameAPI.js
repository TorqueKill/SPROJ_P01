const express = require("express");
const { Quiz, QuizSave } = require("../models/Quiz.js");
const History = require("../models/History.js");

const router = express.Router();

//API:
// '/saveQuiz' - POST - Save the quiz to the database
// '/getQuiz' - GET - Get the quiz from the database
// '/saveHistory' - POST - Save the history to the database
// '/getHistory' - GET - Get the history from the database
module.exports = function () {
  router.post("/saveQuiz", async (req, res) => {
    try {
      const { email, quiz } = req.body;
      const quizSave = new QuizSave({
        email,
        quiz,
      });
      const result = await quizSave.save();
      res.status(201).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error saving quiz");
    }
  });

  //get the quiz from the database based on the email
  router.get("/getQuiz", async (req, res) => {
    try {
      const { email } = req.query;
      const quiz = await QuizSave.find({ email });
      res.status(200).send(quiz);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error getting quiz");
    }
  });

  router.post("/saveHistory", async (req, res) => {
    try {
      const { email, gameHistory, type } = req.body;
      const history = new History({
        email,
        gameHistory,
        type,
      });
      const result = await history.save();
      res.status(201).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error saving history");
    }
  });

  //get the history from the database based on the email
  router.get("/getHistory", async (req, res) => {
    try {
      const { email } = req.query;
      const history = await History.find({ email });
      res.status(200).send(history);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error getting history");
    }
  });

  return router;
};
