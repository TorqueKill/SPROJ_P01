const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Quiz Question schema
const quizQuestionSchema = new Schema({
  question: String,
  answer: String,
  choices: [String],
  timeLimit: Number,
});

// Define the Quiz schema
const quizSchema = new Schema({
  title: String,
  type: String,
  quiz: [quizQuestionSchema],
  otherDetails: {},
});

const quizWrapper = new Schema({
  email: String,
  quiz: quizSchema,
});

const Quiz = mongoose.model("Quiz", quizSchema);
const QuizSave = mongoose.model("QuizSave", quizWrapper);

module.exports = { Quiz, QuizSave };
