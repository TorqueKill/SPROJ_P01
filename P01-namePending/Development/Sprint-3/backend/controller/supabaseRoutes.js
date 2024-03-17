const express = require("express");

const router = express.Router();

module.exports = function (supabase) {
  //saving history to supabase
  router.post("/saveHistory", async (req, res) => {
    //code here
    const { email, gameHistory } = req.body;

    try {
      const { data, error } = await supabase
        .from('save_history')
        .upsert({ email: email, game_history: gameHistory });

      if (error) {
        throw error;
      }

      res.status(200).json({ message: 'History saved', data });
    } catch (error) {
      console.error('Error saving history', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
