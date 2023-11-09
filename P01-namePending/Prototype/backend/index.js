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

let rooms = []; // {roomid: "roomid", users: [socketid, socketid, socketid...], host: socketid}

function getRoom(roomid) {
  return rooms.find((room) => room.roomid === roomid);
}

function getRoomIndex(roomid) {
  return rooms.findIndex((room) => room.roomid === roomid);
}

function addUserToRoom(roomid, socketid) {
  let room = getRoom(roomid);
  if (room) {
    room.users.push(socketid);
  } else {
    rooms.push({ roomid: roomid, users: [socketid], host: socketid });
  }
}

function getPlayerNum(roomid) {
  let room = getRoom(roomid);
  if (room) {
    if (room.host) {
      return room.users.length - 1;
    } else {
      return room.users.length;
    }
  } else {
    return 0;
  }
}

function removeUserFromRoom(roomid, socketid) {
  let room = getRoom(roomid);
  if (room) {
    let index = room.users.findIndex((id) => id === socketid);
    if (index !== -1) {
      room.users.splice(index, 1);
    }
  }
}

function removeRoom(roomid) {
  let index = getRoomIndex(roomid);
  if (index !== -1) {
    rooms.splice(index, 1);
  }
}

//make sure id is unique
function makeid(length) {
  unique = false;
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (!unique) {
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    unique = !rooms.find((room) => room.roomid === result);
  }
  return result;
}

server.listen(3001, () => {
  console.log("listening on :3001");
});

io.on("connection", async (socket) => {
  console.log("a user connected with id: " + socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    //emit to all users in room that user left and remove user from room
    let room = rooms.find((room) => room.users.includes(socket.id));
    if (room) {
      removeUserFromRoom(room.roomid, socket.id);
      let playernum = getPlayerNum(room.roomid);
      io.to(room.roomid).emit("user-left", socket.id, playernum);
    }
  });

  socket.on("test", (msg) => {
    console.log("user sent test message");
  });

  socket.on("create-room", () => {
    // create room and add user to it, check if room already exists then create new room and remove user from old room
    //first check if host already has a room
    let host = rooms.find((room) => room.host === socket.id);
    //if host already has a room, remove host from that room
    if (host) {
      removeRoom(host.roomid);
      console.log("removed host from room: " + host.roomid);
    }
    //create new room
    let roomid = makeid(6);
    socket.join(roomid);
    addUserToRoom(roomid, socket.id);
    socket.emit("room-created", roomid);
    console.log("user created room: " + roomid);
  });

  socket.on("join-room", (roomid) => {
    console.log("user joined room: " + roomid);
    socket.join(roomid);
    addUserToRoom(roomid, socket.id);

    let playernum = getPlayerNum(roomid);
    io.to(roomid).emit("user-joined", socket.id, playernum);
  });
});
