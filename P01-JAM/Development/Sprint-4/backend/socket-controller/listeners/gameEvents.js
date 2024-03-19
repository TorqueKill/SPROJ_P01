module.exports = (socket, io, gameManager, config, rooms, users) => {
  const MAX_PLAYERS_PER_LOBBY = config.MAX_PLAYERS_PER_LOBBY;
  const MIN_PLAYERS_PER_LOBBY = config.MIN_PLAYERS_PER_LOBBY;
  const TIME_PER_QUESTION = config.TIME_PER_QUESTION; //seconds
  const LAG_BIAS = config.LAG_BIAS; //seconds
  const DEFAUL_PLAYER_NAME = config.DEFAUL_PLAYER_NAME;
  const REPORT_DISPLAY_TIME = config.REPORT_DISPLAY_TIME;

  socket.on("pause-timer", (roomid, questionIndex) => {
    let room = gameManager.getRoom(roomid, rooms);
    if (room) {
      room.pauseTimerTime = (Date.now() - room.startTimeStampOfTimer) / 1000;
      clearTimeout(room.timeOutIds[questionIndex]);
      room.timeOutIds.pop();

      io.to(roomid).emit("timer-paused", 1);
    }
  });

  socket.on("resume-timer", (roomid, questionIndex) => {
    let room = gameManager.getRoom(roomid, rooms);
    if (room) {
      let quizObj = gameManager.getRoomQuiz(roomid, rooms);
      // finding remaining time
      let timeLimit =
        quizObj.quiz[questionIndex].timeLimit - room.pauseTimerTime;

      let timeoutId = setTimeout(() => {
        console.log("timeout for question: " + questionIndex);
        io.to(roomid).emit("timeout", questionIndex + 1);
      }, (timeLimit + LAG_BIAS + room.ROOM_LAG_BIAS) * 1000);

      //set timeout id
      gameManager.setQuestionTimeOut(roomid, timeoutId, rooms);
      io.to(roomid).emit("timer-resumed", 1);
    }
  });

  socket.on("handle-answer", (roomid, answer, questionIndex) => {
    try {
      // Check if this a reconnected user and if so, get the current question index

      if (questionIndex !== gameManager.getRoomCurrentQuestion(roomid, rooms)) {
        questionIndex = gameManager.getRoomCurrentQuestion(roomid, rooms);
      }

      console.log(
        "answer received: " + answer + " questionIndex: " + questionIndex,
        "roomid: " + roomid
      );

      //check if answer is undefined or questionIndex is undefined
      if (answer === undefined || questionIndex === undefined) {
        return;
      }

      let room = gameManager.getRoom(roomid, rooms);
      if (room) {
        timeAnswered = (Date.now() - room.startTimeStampOfTimer) / 1000;
        console.log("Time taken to answer: " + timeAnswered);
        gameManager.handleAnswer(
          roomid,
          socket.id,
          answer,
          questionIndex,
          timeAnswered,
          rooms
        );
      }

      //check if all players have answered, emit next question
      //if last question, emit final scores
      //if questionPerReport is not -1, check if questionIndex is a multiple of questionPerReport, if so emit scores till question

      //------------------------------------PERSISTANCE------------------------------------
      //if user is in a vegetative state, count their answer as an empty string

      if (gameManager.checkAllAnswered(roomid, questionIndex, rooms, users)) {
        let scores = [];

        //<------------------------------------FINAL SCORES------------------------------------>

        if (
          questionIndex ===
          gameManager.getRoomQuiz(roomid, rooms).quiz.length - 1
        ) {
          //emit final scores for each player (not host)
          for (let i = 0; i < room.users.length; i++) {
            // check if user is a dummy User
            if (
              room.users[i] !== room.host &&
              !users.find((user) => user.socketid === room.users[i])?.dummyUser
            ) {
              scores.push({
                name: gameManager.getName(room.users[i], users),
                scores: gameManager.getFinalScores(
                  roomid,
                  room.users[i],
                  rooms
                ),
                responseTimes: gameManager.getFinalResponseTimes(
                  roomid,
                  room.users[i],
                  rooms
                ),
                avatarIndex: users.find(
                  (user) => user.socketid === room.users[i]
                )?.avatarIndex,
              });
            }
          }

          //set scores
          //console.log("final scores: " + scores);
          gameManager.setScores(roomid, scores, rooms);
          io.to(roomid).emit("game-end");

          //<------------------------------------REPORTING------------------------------------>
        } else if (
          room.questionsPerReport !== -1 &&
          (questionIndex + 1) % room.questionsPerReport === 0
        ) {
          //emit scores till question
          for (let i = 0; i < room.users.length; i++) {
            // check if user is a dummy user
            if (
              room.users[i] !== room.host &&
              !users.find((user) => user.socketid === room.users[i])?.dummyUser
            ) {
              scores.push({
                name: gameManager.getName(room.users[i], users),
                scores: gameManager.getScoresTillQuestion(
                  roomid,
                  questionIndex + 1,
                  room.users[i],
                  rooms
                ),
                responseTimes: gameManager.getResponseTimesTillQuestion(
                  roomid,
                  questionIndex + 1,
                  room.users[i],
                  rooms
                ),
                avatarIndex: users.find(
                  (user) => user.socketid === room.users[i]
                )?.avatarIndex,
              });
            }
          }

          //console.log("scores till question: " + questionIndex);

          io.to(roomid).emit(
            "scores-till-question",
            scores,
            REPORT_DISPLAY_TIME
          );

          //set timeout for next question
          setTimeout(() => {
            io.to(roomid).emit("next-question", questionIndex + 1);

            gameManager.setRoomCurrentQuestion(
              roomid,
              questionIndex + 1,
              rooms
            );

            //clear timeout for previous question
            clearTimeout(room.timeOutIds[questionIndex]);

            //handle timeout for next question here
            let quizObj = gameManager.getRoomQuiz(roomid, rooms);
            let timeLimit = quizObj.quiz[questionIndex + 1].timeLimit;

            let timeoutId = setTimeout(() => {
              console.log("timeout for question: " + (questionIndex + 1));
              io.to(roomid).emit("timeout", questionIndex + 1);
            }, (timeLimit + LAG_BIAS + room.ROOM_LAG_BIAS) * 1000);

            //set timeout id
            gameManager.setQuestionTimeOut(roomid, timeoutId, rooms);
          }, (REPORT_DISPLAY_TIME + LAG_BIAS + room.ROOM_LAG_BIAS) * 1000);

          //<------------------------------------NEXT QUESTION------------------------------------>
        } else {
          io.to(roomid).emit("next-question", questionIndex + 1);

          gameManager.setRoomCurrentQuestion(roomid, questionIndex + 1, rooms);

          //clear timeout for previous question
          clearTimeout(room.timeOutIds[questionIndex]);

          //handle timeout for next question here
          let quizObj = gameManager.getRoomQuiz(roomid, rooms);
          let timeLimit = quizObj.quiz[questionIndex + 1].timeLimit;

          let timeoutId = setTimeout(() => {
            console.log("timeout for question: " + (questionIndex + 1));
            io.to(roomid).emit("timeout", questionIndex + 1);
          }, (timeLimit + LAG_BIAS + room.ROOM_LAG_BIAS) * 1000);

          //set timeout id
          gameManager.setQuestionTimeOut(roomid, timeoutId, rooms);
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("reconnected", (roomid) => {
    //user reconnected and now is in game screen, remove user from vegetative state

    //find user in users using socketid and roomid
    let user = users.find(
      (user) => user.socketid === socket.id && user.roomid === roomid
    );
    if (user) {
      user.vegetativeState = false;
    }
  });

  socket.on("late-connected", (roomid) => {
    //user joined late and now is in game screen, remove user from vegetative state
    let user = users.find(
      (user) => user.socketid === socket.id && user.roomid === roomid
    );
    if (user) {
      user.vegetativeState = false;
    }
  });
};
