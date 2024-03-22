const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = function () {
  router.post("/signup", async (req, res) => {
    console.log("Signup request received");
    try {
      const { username, email, password } = req.body;
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).send("User already exists");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user instance
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Save the new user
      const result = await user.save();
      console.log("User registered", result);

      let response = {
        username: user.username,
        email: user.email,
        message: "User registered",
        result: result,
      };

      res.status(201).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error registering user");
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(401).send("Invalid password");
      }

      res.status(200).send("User logged in");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error logging in");
    }
  });
  return router;
};
