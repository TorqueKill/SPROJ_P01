//@ts-nocheck
import { BACKEND_URL } from "../config.js";
import axios from "axios";

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

//API:
// '/auth/signup' - POST - Register a new user - needs username, email, and password
// '/auth/signin' - POST - Login an existing user - needs email and password

// Register a new user
async function signup(username, email, password) {
  try {
    const response = await axios.post("/auth/signup", {
      username,
      email,
      password,
    });
    console.log("User registered successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
}

// Login an existing user
async function signin(email, password) {
  const normalFetch = `${BACKEND_URL}/auth/signin`;
  const devFetch = `${BACKEND_URL}/dev/auth/signin`;

  let fetchUrl = normalFetch;
  console.log("Email", email)

  if (email.includes("@dev")) {
    fetchUrl = devFetch;
  }
  try {
    const response = await axios.post(fetchUrl, { email, password });
    console.log("User logged in successfully", response);
    return response.data;
  } catch (error) {
    console.error("Error logging in user", error);
    throw error;
  }
}

export { signup, signin };
