const { Server } = require("socket.io");
const gameManager = require("./gameManager.js");
const config = require("../config/config.js");
const roomEvents = require("./listeners/roomEvents.js");
const gameEvents = require("./listeners/gameEvents.js");

let rooms = [];
let users = [];

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log("a user connected with id: " + socket.id);
    console.log("users: " + users);

    roomEvents(socket, io, gameManager, config, rooms, users);
    gameEvents(socket, io, gameManager, config, rooms, users);

    socket.on("disconnect", () => {
      console.log("user disconnected");

      //emit to all users in room that user left and remove user from room

      //------------------------------------PERSISTANCE------------------------------------
      //if user emits disconnect, it means connection was lost, so do not remove user from room put the user in a vegetative state
      //user MUST emit a seperate leave room event to leave room so remove below code and put it in a seperate event

      //user is put in a vegetative state

      //TODO LATER: if host disconnects, everyone is kicked out of the room and the room is deleted

      //check if user is host
      let host = rooms.find((room) => room.host === socket.id);
      //clear all timeouts
      if (host) {
        for (let i = 0; i < host.timeOutIds.length; i++) {
          clearTimeout(host.timeOutIds[i]);
        }
        //delete room, emit to all users in room that room was deleted
        gameManager.removeAllUsers(host.roomid, rooms, users);
        io.to(host.roomid).emit("room-deleted");
        gameManager.removeRoom(host.roomid, rooms);
        console.log("removed host from room: " + host.roomid);
      }

      let room = rooms.find((room) => room.users.includes(socket.id));

      if (room) {
        //find user in users and set vegetative state to true
        let user = users.find((user) => user.socketid === socket.id);
        if (user) {
          user.vegetativeState = true;
        }

        return;

        //remove user from users
        // removeName(socket.id, room.roomid);
        // removeUserFromRoom(room.roomid, socket.id);

        // //broadcast to all users in room that user left
        // let playernum = getPlayerNum(room.roomid);
        // let names = getAllUsers(room.roomid, false);
        // io.to(room.roomid).emit("user-left", socket.id, playernum, names);
      }
    });
  });

  return io;
};
