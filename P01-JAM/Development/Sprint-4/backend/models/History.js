const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Quiz } = require("./Quiz.js");

// Define the Score schema
const scoreSchema = new Schema({
  name: String,
  scores: [Number],
  responseTimes: [Number],
});

// Define the Game History schema
const gameHistorySchema = new Schema({
  quiz: Quiz.schema,
  scores: [scoreSchema],
});

// Define the main History schema
const historySchema = new Schema({
  email: String,
  gameHistory: [gameHistorySchema],
  type: String,
});

// Create the model from the schema
const History = mongoose.model("History", historySchema);

module.exports = History;
