const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server); // < Interesting!


app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// host will be assigned a room id
// look to start game
// host will send room id to players
// players will join room
// host will start game
// host will send question to players
// players will send answers to host
// host will send answers to players
// players will vote on answers



server.listen(3000, () => {
  console.log("listening on *:3000");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("test", (msg) => {
    console.log("user sent test message");
    
  });

  socket.on("hello", (msg) => {
    console.log("user sent hello message");
    
  })
});


