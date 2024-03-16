const express = require("express");

const router = express.Router();

module.exports = function (supabase) {
  //saving history to supabase
  router.post("/saveHistory", async (req, res) => {
    //code here
  });

  return router;
};
