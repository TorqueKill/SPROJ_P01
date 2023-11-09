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

//quiz is defined as an array of objects with the following properties: question, answer, choices
//quiz = [{question: "question", answer: "answer", choices: ["choice1", "choice2", "choice3", "choice4"]}, ...]]
let rooms = []; // {roomid: "roomid", users: [socketid, socketid, socketid...], host: socketid, quiz: quiz, answers:[], gameStarted: false, sessionLoaded: [], scores: [], maxPlayers: MIN_PLAYERS_PER_LOBBY}

const MAX_PLAYERS_PER_LOBBY = 10;
const MIN_PLAYERS_PER_LOBBY = 2;

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
    rooms.push({
      roomid: roomid,
      users: [socketid],
      host: socketid,
      quiz: [],
      answers: {},
      gameStarted: false,
      sessionLoaded: [],
      scores: [],
      maxPlayers: MIN_PLAYERS_PER_LOBBY,
    });
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

function setScores(roomid, scores) {
  let room = getRoom(roomid);
  if (room) {
    room.scores = scores;
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

function getRoomQuiz(roomid) {
  let room = getRoom(roomid);
  if (room) {
    return room.quiz;
  } else {
    return null;
  }
}

function setRoomQuiz(roomid, quiz) {
  let room = getRoom(roomid);
  if (room) {
    room.quiz = quiz;
  }
}

function setRoomMaxPlayers(roomid, maxPlayers) {
  let room = getRoom(roomid);
  if (room) {
    room.maxPlayers = maxPlayers;
  }
}

function getRoomMaxPlayers(roomid) {
  let room = getRoom(roomid);
  if (room) {
    return room.maxPlayers;
  } else {
    return MIN_PLAYERS_PER_LOBBY;
  }
}

function makeDummyStringList(length) {
  let result = [];
  for (let i = 0; i < length; i++) {
    result.push("");
  }
  return result;
}

function handleAnswer(roomid, socketid, answer, questionIndex) {
  let room = getRoom(roomid);
  let choicesIdx = answer;
  //answers are stored in a list of dictionaries which is the same length as the quiz
  //check if dictionary for socketid exists, if not create it
  //answer is sent as an index of the choices array, translate to the actual answer

  if (room) {
    if (!room.answers[socketid]) {
      room.answers[socketid] = makeDummyStringList(room.quiz.length);
    }
    let answer = room?.quiz[questionIndex]?.choices[choicesIdx];

    //console.log("choices : ", room.quiz[questionIndex].choices)
    //if answer is undefined, set answer to first choice
    if (!answer) {
      answer = room.quiz[questionIndex].choices[0];
    }
    room.answers[socketid][questionIndex] = answer;
  }
}

function checkAllAnswered(roomid, questionIndex) {
  let room = getRoom(roomid);
  if (room) {
    let numAnswers = 0;
    console.log(room.answers);
    for (let key in room.answers) {
      if (room.answers[key][questionIndex]) {
        numAnswers++;
      }
    }
    if (numAnswers === room.users.length - 1) {
      return true;
    }
  }
  return false;
}

//for each id, get the number of correct answers in the form of a list of 1s and 0s = [1, 0, 1, 1, 0, 1, 0, 1, 1, 1] where length = number of questions
function getFinalScores(roomid, socketid) {
  let room = getRoom(roomid);
  let scores = [];
  if (room) {
    if (room.answers[socketid]) {
      let quiz = room.quiz;
      let answers = room.answers[socketid];
      for (let i = 0; i < quiz.length; i++) {
        if (quiz[i].answer === answers[i]) {
          scores.push(1);
        } else {
          scores.push(0);
        }
      }
    }
  }
  return scores;
}

server.listen(process.env.PORT || 3001, () => {
  console.log("listening on 3001");
});

//TODO LATER: add error handling for all functions
//TODO LATER: everytime a user is connected make sure they are sent to the home screen

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

  socket.on("create-room", (quiz, maxPlayers) => {
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
    setRoomQuiz(roomid, quiz);
    setRoomMaxPlayers(roomid, maxPlayers);
    socket.emit("room-created", roomid);
    console.log("user created room: " + roomid);
    console.log("Quiz received, first question: " + quiz[0].question);
  });

  socket.on("join-room", (roomid) => {
    if (
      getRoom(roomid)?.gameStarted ||
      getRoom(roomid)?.users.length - 1 >= getRoomMaxPlayers(roomid)
    ) {
      socket.emit("room-full");
      return;
    }

    console.log("user joined room: " + roomid);
    socket.join(roomid);
    addUserToRoom(roomid, socket.id);

    let playernum = getPlayerNum(roomid);
    io.to(roomid).emit("user-joined", socket.id, playernum);

    if (playernum >= getRoomMaxPlayers(roomid)) {
      rooms[getRoomIndex(roomid)].gameStarted = true;
      io.to(roomid).emit("game-start", getRoomQuiz(roomid));
    }
  });

  socket.on("session-loaded", (roomid, screenid) => {
    console.log("session loaded: " + socket.id);
    let room = getRoom(roomid);
    if (room) {
      //count number of users that have loaded session, if all users have loaded session, emit next question
      //TODO LATER: implement dictionary of users that have loaded session and it is true or false
      room.sessionLoaded.push(socket.id);
      if (room.sessionLoaded.length === room.users.length) {
        console.log("all users have loaded session: " + screenid);

        //screen = 4 is game screen
        if (screenid == 4) {
          io.to(roomid).emit("next-question", 0);
          //reset session loaded
          room.sessionLoaded = [];
        }

        if (screenid == 5) {
          io.to(roomid).emit("final-scores", room.scores);
          //reset session loaded
          room.sessionLoaded = [];
        }
      }
    }
  });

  //TODO LATER : answers must be within a certain time limit
  socket.on("handle-answer", (roomid, answer, questionIndex) => {
    console.log(
      "answer received: " + answer + " questionIndex: " + questionIndex,
      "roomid: " + roomid
    );

    if (answer === undefined || questionIndex === undefined) {
      return;
    }

    let room = getRoom(roomid);
    if (room) {
      handleAnswer(roomid, socket.id, answer, questionIndex);
    }
    //check if all players have answered, emit next question
    //if last question, emit final scores

    if (checkAllAnswered(roomid, questionIndex)) {
      let scores = [];
      if (questionIndex === getRoomQuiz(roomid).length - 1) {
        //emit final scores for each player (not host)
        for (let i = 0; i < room.users.length; i++) {
          if (room.users[i] !== room.host) {
            scores.push(getFinalScores(roomid, room.users[i]));
          }
        }

        //set scores
        setScores(roomid, scores);
        io.to(roomid).emit("game-end");
      } else {
        io.to(roomid).emit("next-question", questionIndex + 1);
      }
    }
  });
});
