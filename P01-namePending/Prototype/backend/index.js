const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const Server = require("socket.io").Server;
// import {Server} from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// const io = require("socket.io")(server); // < Interesting!

// host will be assigned a room id
// look to start game
// host will send room id to players
// players will join room
// host will start game
// host will send question to players
// players will send answers to host
// host will send answers to players
// players will vote on answers

server.listen(3001, () => {
  console.log("listening on :3001");
});

io.on("connection", async (socket) => {
  console.log("a user connected with id: " + socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("test", (msg) => {
    console.log("user sent test message");
  });
});
