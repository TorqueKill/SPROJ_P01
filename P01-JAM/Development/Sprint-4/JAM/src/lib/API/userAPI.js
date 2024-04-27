//@ts-nocheck
import { BACKEND_URL, VALIDATION_CHECKS_AUTH } from "../config.js";
import axios from "axios";

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

// Validation check function
function validate(email, password = null, username = null) {
  let errors = {};

  // Check if fields are non-empty
  if (!email) errors.email = "Email is required.";

  if (password !== null) {
    if (!password) errors.password = "Password is required.";
  }

  if (username !== null && username === "")
    errors.username = "Username cannot be empty.";

  const emailRegex = new RegExp(VALIDATION_CHECKS_AUTH.email_AllowedCharacters);
  const passwordRegex = new RegExp(
    VALIDATION_CHECKS_AUTH.password_AllowedCharacters
  );

  // Validate Email
  if (
    email &&
    (!emailRegex.test(email) ||
      email.length > VALIDATION_CHECKS_AUTH.email_LengthLimit)
  ) {
    errors.email = "Invalid email format or length.";
  }

  // Validate Password
  if (password !== null) {
    if (
      password &&
      (!passwordRegex.test(password) ||
        password.length < VALIDATION_CHECKS_AUTH.password_MinLength ||
        password.length > VALIDATION_CHECKS_AUTH.password_LengthLimit ||
        (VALIDATION_CHECKS_AUTH.password_SpecialCharacterRequired &&
          !/[!@#$%^&*()_+=-]/.test(password)) ||
        (VALIDATION_CHECKS_AUTH.password_UppercaseRequired &&
          !/[A-Z]/.test(password)) ||
        (VALIDATION_CHECKS_AUTH.password_NumberRequired &&
          !/\d/.test(password)))
    ) {
      errors.password = "Password does not meet complexity requirements.";
    }
  }

  // Validate Username if provided
  if (username !== null) {
    const usernameRegex = new RegExp(
      VALIDATION_CHECKS_AUTH.username_AllowedCharacters
    );
    if (
      !usernameRegex.test(username) ||
      username.length > VALIDATION_CHECKS_AUTH.username_LengthLimit
    ) {
      errors.username = "Invalid username format or length.";
    }
  }

  if (Object.keys(errors).length > 0) {
    throw { errors, message: "Validation failed", status: 400 };
  }
}

// API:
// '/auth/signup' - POST - Register a new user - needs username, email, and password
// '/auth/signin' - POST - Login an existing user - needs email and password

// Register a new user
async function signup(username, email, password) {
  try {
    validate(email, password, username);
    const response = await axios.post("/auth/signup", {
      username,
      email,
      password,
    });
    console.log("User registered successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user", error);
    if (error.errors) {
      console.error("Validation errors", error.errors);
    } else if (error.response.status === 409) {
      throw error;
    }
    throw error;
  }
}

// Login an existing user
async function signin(email, password) {
  let fetchUrl = email.includes("@dev")
    ? `${BACKEND_URL}/dev/auth/signin`
    : `${BACKEND_URL}/auth/signin`;
  console.log("Email", email);

  try {
    validate(email);
    const response = await axios.post(fetchUrl, { email, password });
    console.log("User logged in successfully", response);
    return response.data;
  } catch (error) {
    console.error("Error logging in user", error);
    if (error.errors) {
      console.error("Validation errors", error.errors);
    } else if (error.response.status === 401) {
      throw error;
    }
    throw error;
  }
}

export { signup, signin };
