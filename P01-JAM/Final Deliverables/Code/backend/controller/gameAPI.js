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

      //if either the email or quiz is missing, send a 400 response
      if (!email || !quiz) {
        return res.status(400).send("Missing email or quiz.");
      }

      if (email === "" || quiz === "") {
        return res.status(400).send("Email or quiz cannot be empty.");
      }

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

      //if either the email, page or pageSize is missing, send a 400 response
      if (!email || !page || !pageSize) {
        return res.status(400).send("Missing email, page or pageSize.");
      }

      if (email === "" || page === "" || pageSize === "") {
        return res.status(400).send("Email, page or pageSize cannot be empty.");
      }

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

      //if either the email, quiz or id is missing, send a 400 response
      if (!email || !quizUpdate || !quizId) {
        return res.status(400).send("Missing email, quiz or id.");
      }

      if (email === "" || quizUpdate === "" || quizId === "") {
        return res.status(400).send("Email, quiz or id cannot be empty.");
      }

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

      //if either the email, gameHistory or type is missing, send a 400 response
      if (!email || !gameHistory || !type) {
        return res.status(400).send("Missing email, gameHistory or type.");
      }

      if (email === "" || gameHistory === "" || type === "") {
        return res
          .status(400)
          .send("Email, gameHistory or type cannot be empty.");
      }

      console.log(email, gameHistory, type);

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
      const { email, page, pageSize, type } = req.query;

      //if either the email, page or pageSize is missing, send a 400 response
      if (!email || !page || !pageSize || !type) {
        return res.status(400).send("Missing email, page or pageSize.");
      }

      if (email === "" || page === "" || pageSize === "" || type === "") {
        return res.status(400).send("Email, page or pageSize cannot be empty.");
      }

      console.log(email, page, pageSize, type);

      // Convert page and pageSize to numbers, providing default values if necessary
      const pageNum = parseInt(page, 10) || 1;
      const pageSizeNum = parseInt(pageSize, 10) || 10;

      // Calculate the number of documents to skip
      const skips = pageSizeNum * (pageNum - 1);

      console.log(pageNum, pageSizeNum, skips);

      // Find the history with pagination
      const history = await History.find({ email, type })
        .skip(skips)
        .limit(pageSizeNum);

      // Optionally, you can also send the total number of history for the client to calculate the total pages
      const count = await History.countDocuments({ email, type });

      res.status(200).send({ history, total: count });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error getting history");
    }
  });

  return router;
};
