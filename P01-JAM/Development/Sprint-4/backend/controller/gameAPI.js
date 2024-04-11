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
      const { email, page, pageSize } = req.query;

      console.log(email, page, pageSize);

      // Convert page and pageSize to numbers, providing default values if necessary
      const pageNum = parseInt(page, 10) || 1;
      const pageSizeNum = parseInt(pageSize, 10) || 10;

      // Calculate the number of documents to skip
      const skips = pageSizeNum * (pageNum - 1);

      console.log(pageNum, pageSizeNum, skips);

      // Find the quizzes with pagination
      const quizzes = await QuizSave.find({ email })
        .skip(skips)
        .limit(pageSizeNum);

      // Optionally, you can also send the total number of quizzes for the client to calculate the total pages
      const count = await QuizSave.countDocuments({ email });

      res.status(200).send({ quizzes, total: count });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error getting quiz");
    }
  });

  //update the quiz in the database using the id
  // Update the quiz within the QuizSave document by the quiz's id
  router.put("/updateQuiz", async (req, res) => {
    try {
      const email = req.body.email;
      const quizUpdate = req.body.quiz;
      const quizId = req.body.id;
      console.log(email, quizUpdate, quizId);

      // Find the QuizSave document that contains the quiz with the given id
      const quizSave = await QuizSave.findOne({
        "quiz._id": quizId,
        email: email,
      });

      console.log(quizSave);

      // If no document is found, or the email does not match, send a 404 response
      if (!quizSave) {
        return res.status(404).send("Quiz not found or email does not match.");
      }

      //use the id from quizSave to update the whole wrapper
      const ID = quizSave._id;
      const result = await QuizSave.findByIdAndUpdate(
        ID,
        { quiz: quizUpdate },
        { new: true }
      );

      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating quiz");
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
