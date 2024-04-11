//@ts-nocheck
import { BACKEND_URL } from "../config.js";
import axios from "axios";

//API:
// '/game/saveQuiz' - POST - Save the quiz to the database - needs email and quiz
// '/game/getQuiz' - GET - Get the quiz from the database - needs email
// '/game/saveHistory' - POST - Save the history to the database - needs email, gameHistory, and type
// '/game/getHistory' - GET - Get the history from the database - needs email

// Set up axios defaults (optional)
axios.defaults.baseURL = BACKEND_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

// Save the quiz to the database
async function saveQuiz(email, quiz) {
  try {
    const response = await axios.post("/game/saveQuiz", { email, quiz });
    console.log("Quiz saved successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving quiz", error);
    throw error;
  }
}

// Get the quiz from the database
async function getQuiz(email, page, pageSize) {
  try {
    const response = await axios.get("/game/getQuiz", {
      params: { email, page, pageSize },
    });
    console.log("Quiz fetched successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz", error);
    throw error;
  }
}

async function updateQuiz(email, quiz, id) {
  try {
    const response = await axios.put("/game/updateQuiz", { email, quiz, id });
    console.log("Quiz updated successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating quiz", error);
    throw error;
  }
}

// Save the game history to the database
async function saveHistory(email, gameHistory, type) {
  try {
    const response = await axios.post("/game/saveHistory", {
      email,
      gameHistory,
      type,
    });
    console.log("History saved successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving history", error);
    throw error;
  }
}

// Get the game history from the database
async function getHistory(email) {
  try {
    const response = await axios.get("/game/getHistory", { params: { email } });
    console.log("History fetched successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching history", error);
    throw error;
  }
}

export { saveQuiz, getQuiz, saveHistory, getHistory, updateQuiz };
