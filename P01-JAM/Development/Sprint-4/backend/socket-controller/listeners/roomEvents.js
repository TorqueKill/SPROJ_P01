module.exports = (socket, io, gameManager, config, rooms, users) => {
  const MAX_PLAYERS_PER_LOBBY = config.MAX_PLAYERS_PER_LOBBY;
  const MIN_PLAYERS_PER_LOBBY = config.MIN_PLAYERS_PER_LOBBY;
  const TIME_PER_QUESTION = config.TIME_PER_QUESTION; //seconds
  const LAG_BIAS = config.LAG_BIAS; //seconds
  const DEFAUL_PLAYER_NAME = config.DEFAUL_PLAYER_NAME;
  const REPORT_DISPLAY_TIME = config.REPORT_DISPLAY_TIME;
  const QUESTION_TITLE_TIME = config.QUESTION_TITLE_TIME; //seconds

  socket.on("create-room", (quizObj, roomSettings, userData) => {
    // create room and add user to it, check if room already exists then create new room and remove user from old room

    //first check if host already has a room
    let host = rooms.find((room) => room.host === socket.id);

    //if host already has a room, remove host from that room
    if (host) {
      gameManager.removeRoom(host.roomid, rooms);
      console.log("removed host from room: " + host.roomid);
    }

    let name = userData.username;
    let email = userData.email;

    //create new room
    let roomid = gameManager.makeid(6, rooms);
    socket.join(roomid);
    gameManager.addUserToRoom(roomid, socket.id, rooms, rooms);
    gameManager.setRoomQuiz(roomid, quizObj, rooms);
    gameManager.setRoomMaxPlayers(roomid, roomSettings.maxPlayers, rooms);
    gameManager.setQuestionsPerReport(roomid, roomSettings.reportScores, rooms);
    gameManager.setRoomDisplayQuestion(
      roomid,
      roomSettings.displayQuestion,
      rooms
    );
    gameManager.setUser(socket.id, roomid, name, email, 0, rooms, users); //default avatar index is 0
    socket.emit("room-created", roomid);
    console.log("user created room: " + roomid);
    console.log("Quiz received, first question: " + quizObj.quiz[0].question);
  });

  socket.on("join-room", (roomid, userData) => {
    //check if room is full or game has started, if so emit error

    //------------------------------------PERSISTANCE------------------------------------
    //if room is full, emit error and do not join room/ game started and is not logged in do same

    //DO FOLLOWING IF USER HAS LOGGED IN AND WAS IN A ROOM BEFORE:
    //if game has started, check if the user is was in the room before and if so, start user reconnection process
    //user reconnection process: reconnect-> next-question (current question)
    //make a function that gets the current question index given a roomid
    //when a previous user joins, they will have different socketid, so make sure to update the socketid in the room

    //NOTE dead/non responsive users in lobby are treated normal users, they are not removed from the room
    //TODO LATER: possibly remove them based on certain conditions/ timeout

    //check if room exists
    if (!gameManager.getRoom(roomid, rooms)) {
      return;
    }

    console.log("users: ", users);

    let name = userData.username;
    let email = userData.email;
    let avatarIndex = userData.avatarIndex;

    if (!name) {
      name = DEFAUL_PLAYER_NAME;
    }

    //check if user logged in
    if (email === undefined || email === "") {
      //if game started, return
      if (gameManager.getRoom(roomid, rooms).gameStarted) {
        socket.emit("room-full");
        return;
      }
    }

    if (
      gameManager.reconnectionInit(
        roomid,
        socket.id,
        email,
        name,
        avatarIndex,
        users,
        rooms
      )
    ) {
      //begin reconnection process
      console.log("reconnection process started: " + socket.id + email);
      console.log("avatarIndex: " + avatarIndex);
      socket.join(roomid);
      //get room quiz
      let quizObj = gameManager.getRoomQuiz(roomid, rooms);
      let data = {
        quiz: quizObj,
        currentQuestion: gameManager.getRoom(roomid, rooms).currentQuestion,
      };

      socket.emit("reconnect", data);
      return;
    }

    //check if room is full
    if (
      gameManager.getRoom(roomid, rooms)?.users.length - 1 >=
      gameManager.getRoomMaxPlayers(roomid, rooms)
    ) {
      // check if there are dummy users in the room. If yes, then room has less than max players

      if (
        gameManager.lateConnectionInit(
          roomid,
          socket.id,
          email,
          name,
          avatarIndex,
          users,
          rooms
        )
      ) {
        //begin reconnection process
        console.log("late connection process started: " + socket.id + email);
        socket.join(roomid);
        //get room quiz
        let quiz = gameManager.getRoomQuiz(roomid, rooms);
        socket.emit("late-connect", quiz);
        // let data = {
        //   quiz: quiz,
        //   currentQuestion: gameManager.getRoom(roomid, rooms).currentQuestion,
        // };

        // socket.emit("late-connect", data);
        return;
      }

      socket.emit("room-full");
      return;
    }

    // if (gameManager.getRoom(roomid, rooms).gameStarted) {

    //   // if game has started, add user to room and emit to all users in room that user joined
    //   console.log("user joined room: " + roomid);
    //   socket.join(roomid);
    //   gameManager.addUserToRoom(roomid, socket.id, rooms);

    //   //emit to all users in room that user joined
    //   let playernum = gameManager.getPlayerNum(roomid, rooms););
    //   let users = gameManager.getAllUsers(roomid, false, rooms, users);
    //   io.to(roomid).emit("user-joined", socket.id, playernum, users);
    //   return;

    // }

    gameManager.setUser(
      socket.id,
      roomid,
      name,
      email,
      avatarIndex,
      rooms,
      users
    );

    //add user to room and emit to all users in room that user joined
    console.log("user joined room: " + roomid);
    socket.join(roomid);
    gameManager.addUserToRoom(roomid, socket.id, rooms);

    //emit to all users in room that user joined
    let playernum = gameManager.getPlayerNum(roomid, rooms);
    let _users = gameManager.getAllUsers(roomid, false, rooms, users);

    io.to(roomid).emit("user-joined", socket.id, playernum, _users);

    //if room is full, emit game start
    if (playernum >= gameManager.getRoomMaxPlayers(roomid, rooms)) {
      rooms[gameManager.getRoomIndex(roomid, rooms)].gameStarted = true;

      //start measuring lag bias as send this to all users
      rooms[gameManager.getRoomIndex(roomid, rooms)].ROOM_LAG_BIAS = Date.now();

      roomSettings = {
        displayQuestion: gameManager.getRoom(roomid, rooms).displayQuestion,
      };

      io.to(roomid).emit(
        "game-start",
        gameManager.getRoomQuiz(roomid, rooms),
        roomSettings
      );
    }
  });

  socket.on("force-start-game", (roomid) => {
    let room = gameManager.getRoom(roomid, rooms);
    if (room) {
      rooms[gameManager.getRoomIndex(roomid, rooms)].gameStarted = true;
      rooms[gameManager.getRoomIndex(roomid, rooms)].ROOM_LAG_BIAS = Date.now();
      roomSettings = {
        displayQuestion: gameManager.getRoom(roomid, rooms).displayQuestion,
      };

      remainingPlayers =
        gameManager.getRoomMaxPlayers(roomid, rooms) - (room.users.length - 1);

      // adding remaining players as dummy users

      for (let i = 1; i < 1 + remainingPlayers; i++) {
        console.log("Adding dummy user: " + i + " to room: " + roomid);

        let dummyUser = {
          socketid: "dummy" + i,
          name: "dummy" + i,
          roomid: roomid,
          email: "dummy" + i + "@dummy.com",
          vegetativeState: true,
          dummyUser: true,
          justReconnected: false,
          avatarIndex: 0,
        };

        gameManager.setDummyUser(
          dummyUser.roomid,
          dummyUser.socketid,
          dummyUser.name,
          dummyUser.email,
          dummyUser.avatarIndex,
          rooms,
          users
        );
        gameManager.addUserToRoom(roomid, dummyUser.socketid, rooms);
      }

      io.to(roomid).emit(
        "game-start",
        gameManager.getRoomQuiz(roomid, rooms),
        roomSettings
      );
    }
  });

  socket.on("session-loaded", (roomid, screenid) => {
    console.log("session loaded: " + socket.id);
    let room = gameManager.getRoom(roomid, rooms);
    if (room) {
      //count number of users that have loaded session, if all users have loaded session, emit next question

      //------------------------------------PERSISTANCE------------------------------------
      //TODO LATER: given a certain number of users have loaded, start a countdown timer and if all users have not loaded by the end of the timer, emit next question
      //TODO LATER: users not loaded will be in a vegetative state, new check should mark these users as loaded

      room.sessionLoaded.push(socket.id);
      if (gameManager.checkSessionLoaded(roomid, rooms, users)) {
        console.log("all users have loaded session: " + screenid);

        //screen = 4 is game screen
        if (screenid == 4) {
          io.to(roomid).emit("next-question", 0);

          gameManager.setRoomCurrentQuestion(roomid, 0, rooms);

          //time difference between when game started and now in seconds
          let timeDiff = (Date.now() - room.ROOM_LAG_BIAS) / 1000;
          console.log("Time diff: " + timeDiff);

          //set lag bias which is the time difference between when game started and now
          //and now represents the time it took for all users to load the session
          rooms[gameManager.getRoomIndex(roomid, rooms)].ROOM_LAG_BIAS =
            timeDiff;

          //get room quiz and timeLimit for first question
          let quizObj = gameManager.getRoomQuiz(roomid, rooms);
          let timeLimit = quizObj.quiz[0].timeLimit;

          //timeout for the first question
          let timeoutId = setTimeout(() => {
            console.log("timeout for question: " + 0);
            io.to(roomid).emit("timeout", 1);
          }, (timeLimit + LAG_BIAS + timeDiff + QUESTION_TITLE_TIME) * 1000);

          //set timeout id
          gameManager.setQuestionTimeOut(roomid, timeoutId, rooms);

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

  socket.on("leave-room", (roomid) => {
    //remove user from room and emit to all users in room that user left
    console.log("user left room: " + roomid);
    gameManager.removeName(socket.id, roomid, rooms, users);
    gameManager.removeUserFromRoom(roomid, socket.id, rooms);

    //broadcast to all users in room that user left
    let playernum = gameManager.getPlayerNum(roomid, rooms);
    let _users = gameManager.getAllUsers(roomid, false, rooms, users);
    io.to(roomid).emit("user-left", socket.id, playernum, _users);

    //remember to remove the timeouts from the room

    //if host left, delete room
    let room = gameManager.getRoom(roomid, rooms);
    if (room) {
      //remove timeouts for room
      for (let i = 0; i < room.timeOutIds.length; i++) {
        clearTimeout(room.timeOutIds[i]);
      }

      if (room.host === socket.id) {
        gameManager.removeRoom(roomid, rooms);
      }
    }
  });
};
