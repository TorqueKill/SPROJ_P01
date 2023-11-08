const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const Server = require("socket.io").Server;
// import {Server} from "socket.io";
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
        
    }
});
// const io = require("socket.io")(server); // < Interesting!


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

io.on("connection", async (socket) => {
  console.log("a user connected with id: " + socket.id);    
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("test", (msg) => {
    console.log("user sent test message");
    
  });

  socket.on("createGame", (msg) => {

    const room_id = socket.id;
    socket.join(room_id);
    console.log("user created game with room id: " + room_id);
    socket.emit("gameCreated", room_id);


    
  });

  socket.on("joinGame", (room_id) => {
    socket.join(room_id);
    console.log("user joined game with room id: " + room_id);
    socket.emit("gameJoined", room_id);
  });
});


