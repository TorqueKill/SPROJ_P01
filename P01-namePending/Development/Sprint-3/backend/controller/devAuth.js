const express = require("express");
const router = express.Router();
const devAccounts = require("../config/config").DEV_ACCOUNTS;

router.get("/", (req, res) => {
  res.send("/dev endpoint.");
});

router.get("/auth/signin", (req, res) => {
  const { email, password } = req.body;
  //check if the user is a dev and has entered the correct credentials
  let user = devAccounts.find((user) => user.email === email);
  if (user && user.password === password) {
    return res.status(200).json({ user });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

module.exports = router;
