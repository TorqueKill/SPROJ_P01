const _consts = require("../config/config");

const MIN_PLAYERS_PER_LOBBY = _consts.MIN_PLAYERS_PER_LOBBY;
const DEFAUL_PLAYER_NAME = _consts.DEFAUL_PLAYER_NAME;

//rooms is an array of objects, passed to functions. It must be initialized beforehand in the upper scope

function getRoom(roomid, rooms) {
  return rooms.find((room) => room.roomid === roomid);
}

function getRoomIndex(roomid, rooms) {
  return rooms.findIndex((room) => room.roomid === roomid);
}

function addUserToRoom(roomid, socketid, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      room.users.push(socketid);
    } else {
      rooms.push({
        roomid: roomid,
        users: [socketid],
        host: socketid,
        quiz: [],
        answers: {},
        responseTimes: {},
        gameStarted: false,
        sessionLoaded: [],
        scores: [],
        maxPlayers: MIN_PLAYERS_PER_LOBBY,
        usersNames: {},
        timeOutIds: [],
        startTimeStampOfTimer: -1, // timestamp in milliseconds when the timer was started
        pauseTimerTime: -1, // time elapsed in seconds when the timer was paused since the start of timer
        questionsPerReport: -1,
        ROOM_LAG_BIAS: 0,
        currentQuestion: -1,
        displayQuestion: false,
        bgColor: -1, // default background color index
        bgMusic: -1, // default background music index
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function getPlayerNum(roomid, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      if (room.host) {
        return room.users.length - 1;
      } else {
        return room.users.length;
      }
    } else {
      return 0;
    }
  } catch (e) {
    console.log(e);
  }
}

function setScores(roomid, scores, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.scores = scores;
  }
}

function removeUserFromRoom(roomid, socketid, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      let index = room.users.findIndex((id) => id === socketid);
      if (index !== -1) {
        room.users.splice(index, 1);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function removeRoom(roomid, rooms) {
  try {
    let index = getRoomIndex(roomid, rooms);
    if (index !== -1) {
      rooms.splice(index, 1);
    }
  } catch (e) {
    console.log(e);
  }
}

//make sure id is unique
function makeid(length, rooms) {
  let unique = false;
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

function getRoomQuiz(roomid, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    return room.quiz;
  } else {
    return null;
  }
}

function setRoomQuiz(roomid, quiz, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.quiz = quiz;
  }
}

function setQuestionTimeOut(roomid, timeoutId, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.timeOutIds.push(timeoutId);
    room.startTimeStampOfTimer = Date.now();
  }
}

function setRoomMaxPlayers(roomid, maxPlayers, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.maxPlayers = maxPlayers;
  }
}

function setQuestionsPerReport(roomid, questionsPerReport, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.questionsPerReport = questionsPerReport;
  }
}

function setRoomMusicAndBgColor(roomid, bgMusic, bgColor, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.bgMusic = bgMusic;
    room.bgColor = bgColor;
  }
}

function getRoomMusicAndBgColor(roomid, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    return { bgMusic: room.bgMusic, bgColor: room.bgColor };
  } else {
    return { bgMusic: -1, bgColor: -1 };
  }
}

function getRoomMaxPlayers(roomid, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    return room.maxPlayers;
  } else {
    return MIN_PLAYERS_PER_LOBBY;
  }
}

function setRoomCurrentQuestion(roomid, questionIndex, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.currentQuestion = questionIndex;
  }
}

function getRoomCurrentQuestion(roomid, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    return room.currentQuestion;
  } else {
    return -1;
  }
}

function setRoomDisplayQuestion(roomid, displayQuestion, rooms) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.displayQuestion = displayQuestion;
  }
}

function makeDummyStringList(length) {
  let result = [];
  for (let i = 0; i < length; i++) {
    result.push("");
  }
  return result;
}

function handleAnswer(
  roomid,
  socketid,
  answer,
  questionIndex,
  timeAnswered,
  rooms
) {
  try {
    // if questionIndex is -1, that means user has re-connected so get the current question index

    // if (questionIndex === -1) {
    //   questionIndex = getRoomCurrentQuestion(roomid);
    // }

    let room = getRoom(roomid, rooms);
    let choicesIdx = answer;

    if (room) {
      let quiz;
      if (room.quiz.quiz) {
        quiz = room.quiz.quiz;
      }

      if (!room.answers[socketid]) {
        //
        room.answers[socketid] = makeDummyStringList(quiz.length);
      }

      if (!room.responseTimes[socketid]) {
        room.responseTimes[socketid] = makeDummyStringList(quiz.length);
      }

      let answer = quiz[questionIndex]?.choices[choicesIdx];

      //if answer is undefined, set answer to a default value
      if (!answer) {
        // answer = room.quiz[questionIndex].choices[0];
        answer = "default_value_time_ran_out";

        // time ran out so respone time is 0
        responseTime = 0;
        room.responseTimes[socketid][questionIndex] = responseTime;
        console.log("time remaining: ", responseTime);
      } else {
        // player answered so repsonse time is time limit - timeAnswered
        responseTime = quiz[questionIndex].timeLimit - timeAnswered;
        room.responseTimes[socketid][questionIndex] = responseTime;
        console.log("time remaining: ", responseTime);
      }

      // if answerIndex -1 then that means time ran out for that user
      // so answer is set to emtpy string

      // if (answerIndex === -1) {
      //   answer = 'default_value_time_ran_out';
      // }

      room.answers[socketid][questionIndex] = answer;
    }
  } catch (e) {
    console.log(e);
  }
}

function checkAllAnswered(roomid, questionIndex, rooms, users) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      let numAnswers = 0;
      //console.log(room.answers);
      for (let key in room.answers) {
        console.log(key, room.answers[key]);
        if (room.answers[key][questionIndex]) {
          numAnswers++;
        }
      }
      if (numAnswers === room.users.length - 1) {
        return true;
      }

      //check users in vegetative state
      //console.log(users);
      //console.log(room.users);

      let numVegetative = 0;
      for (let i = 0; i < room.users.length; i++) {
        if (
          users.find((user) => user.socketid === room.users[i])?.vegetativeState
        ) {
          numVegetative++;
        }
      }

      console.log("num vegetative: " + numVegetative);

      //combine numAnswers and vegetative state
      if (numAnswers + numVegetative === room.users.length - 1) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log(e);
  }
}

//returns true if for a given question, they are the first to answer
function checkFirstToAnswer(roomid, questionIndex, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      let numAnswers = 0;
      for (let key in room.answers) {
        if (room.answers[key][questionIndex]) {
          numAnswers++;
        }
      }
      if (numAnswers === 1) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log(e);
  }
}

//returns a list of socketids of people who answered a given question
function getPeopleWhoAnswered(roomid, questionIndex, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      let people = [];
      for (let key in room.answers) {
        if (room.answers[key][questionIndex]) {
          people.push(key);
        }
      }
      return people;
    }
  } catch (e) {
    console.log(e);
  }
}

function getScoresTillQuestion(roomid, questionIndex, socketid, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      let scores = [];
      //return scores for user with socketid, till questionIndex
      for (let i = 0; i < questionIndex; i++) {
        if (room.answers[socketid]) {
          if (room.quiz.quiz[i].answer === room.answers[socketid][i]) {
            scores.push(1);
          } else {
            scores.push(0);
          }
        }
      }

      console.log("scores till question: " + scores);

      return scores;
    }
  } catch (e) {
    console.log(e);
  }
}

//for each id, get the number of correct answers in the form of a list of 1s and 0s = [1, 0, 1, 1, 0, 1, 0, 1, 1, 1] where length = number of questions
function getFinalScores(roomid, socketid, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    let scores = [];
    if (room) {
      if (room.answers[socketid]) {
        let quiz = room.quiz.quiz;
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
  } catch (e) {
    console.log(e);
  }
}

function setUser(socketid, roomid, name, email, avatarIndex, rooms, users) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.usersNames[socketid] = name;
    users.push({
      socketid: socketid,
      name: name,
      roomid: roomid,
      email: email,
      vegetativeState: false,
      dummyUser: false, // this is set to true for the case when game has less than max players before starting
      justReconnected: false,
      avatarIndex: avatarIndex,
    });
  }
}

function setDummyUser(
  roomid,
  socketid,
  name,
  email,
  avatarIndex,
  rooms,
  users
) {
  let room = getRoom(roomid, rooms);
  if (room) {
    room.usersNames[socketid] = name;
    users.push({
      socketid: socketid,
      name: name,
      roomid: roomid,
      email: email,
      vegetativeState: true,
      dummyUser: true,
      justReconnected: false,
      avatarIndex: avatarIndex,
    });
  }
}

function removeName(socketid, roomid, rooms, users) {
  try {
    let room = getRoom(roomid, rooms);
    let _name = users.find((user) => user.socketid === socketid).name;
    if (room) {
      //find matching name in room.usersNames and remove it
      for (let key in room.usersNames) {
        if (room.usersNames[key] === _name) {
          delete room.usersNames[key];
          break;
        }
      }
    }
    //remove user from users
    let index = users.findIndex((user) => user.socketid === socketid);
    if (index !== -1) {
      users.splice(index, 1);
    }
  } catch (e) {
    console.log(e);
  }
}

function getName(socketid, users) {
  let user = users.find((user) => user.socketid === socketid);
  if (user) {
    return user.name;
  } else {
    return DEFAUL_PLAYER_NAME;
  }
}

//all users are marked with their socketid (including host)

function getAllUsers(roomid, includeHost, rooms, users) {
  let room = getRoom(roomid, rooms);
  let names = [];
  if (room) {
    for (let key in room.usersNames) {
      if (includeHost || key !== room.host) {
        //find avatar index else set to 0
        if (users.find((user) => user.socketid === key)) {
          let avatarIndex = users.find(
            (user) => user.socketid === key
          )?.avatarIndex;
          if (avatarIndex === undefined) {
            avatarIndex = 0;
          }
          names.push({ name: room.usersNames[key], avatarIndex: avatarIndex });
        } else {
          names.push({ name: room.usersNames[key], avatarIndex: 0 });
        }
      }
    }
  }
  return names;
}

function reconnectionInit(
  roomid,
  socketid,
  email,
  name,
  avatarIndex,
  users,
  rooms
) {
  try {
    if (email === undefined || email === "") {
      return false;
    }

    //check if user was in room before
    let user = users.find(
      (user) => user.email === email && user.roomid === roomid
    );
    if (user) {
      //note that user.socketid is the old socketid

      //update socketid in room
      let room = getRoom(roomid, rooms);
      if (room) {
        let index = room.users.findIndex((id) => id === user.socketid);
        if (index !== -1) {
          room.users[index] = socketid;
        }
      }

      //update socketid in usernames so new id maps to old name, delete old key
      // let name = getName(user.socketid);
      // room.usersNames[socketid] = name;
      // delete room.usersNames[user.socketid];

      // commented out the above as the username can be different upon re-join

      room.usersNames[socketid] = name;
      delete room.usersNames[user.socketid];

      //update socketid in answers
      console.log("Deleting old socketid from answers");
      let answers = room.answers[user.socketid];

      if (answers) {
        room.answers[socketid] = answers;
        delete room.answers[user.socketid];
      } else {
        room.answers[socketid] = makeDummyStringList(room.quiz.quiz.length);
      }

      //update response times
      let responseTimes = room.responseTimes[user.socketid];

      if (responseTimes) {
        room.responseTimes[socketid] = responseTimes;
        delete room.responseTimes[user.socketid];
      } else {
        room.responseTimes[socketid] = makeDummyStringList(
          room.quiz.quiz.length
        );
      }

      //update avatar index in users
      user.avatarIndex = avatarIndex;
      console.log("Avatar index: " + user.avatarIndex);

      // updating username
      user.name = name;

      //update socketid in users
      user.socketid = socketid;
    } else {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function lateConnectionInit(
  roomid,
  socketid,
  email,
  name,
  avatarIndex,
  users,
  rooms
) {
  try {
    // finding a dummy user that has vegetative state as true

    let user = users.find(
      (user) =>
        user.dummyUser === true &&
        user.vegetativeState === true &&
        user.roomid === roomid
    );

    if (user) {
      let room = getRoom(roomid, rooms);
      if (room) {
        let index = room.users.findIndex((id) => id === user.socketid);
        if (index !== -1) {
          room.users[index] = socketid;
        }
      }

      //update socketid in usernames so new id maps to new name, delete old key
      // let name = getName(user.socketid);
      room.usersNames[socketid] = name;
      delete room.usersNames[user.socketid];

      //update socketid in answers
      console.log("Deleting old socketid from answers");
      let answers = room.answers[user.socketid];

      if (answers) {
        room.answers[socketid] = answers;
        delete room.answers[user.socketid];
      } else {
        room.answers[socketid] = makeDummyStringList(room.quiz.quiz.length);
      }

      // room.answers[socketid] = answers;
      // delete room.answers[user.socketid];

      //update response times
      let responseTimes = room.responseTimes[user.socketid];

      if (responseTimes) {
        room.responseTimes[socketid] = responseTimes;
        delete room.responseTimes[user.socketid];
      } else {
        room.responseTimes[socketid] = makeDummyStringList(
          room.quiz.quiz.length
        );
      }

      //update avatar index in users
      user.avatarIndex = avatarIndex;

      //update socketid in users
      user.socketid = socketid;

      // update name and email
      user.name = name;
      user.email = email;

      // now this is not a dummy user
      user.dummyUser = false;
    } else {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function checkSessionLoaded(roomid, rooms, users) {
  //check if all users have loaded session
  //treat users in vegetative state as loaded
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      if (room.sessionLoaded.length === room.users.length) {
        return true;
      }

      // print all the user names and vegetative state of users in the room

      for (let i = 0; i < room.users.length; i++) {
        console.log("Len: " + room.users.length);
        console.log(
          "User: " +
            room.users[i] +
            " vegetative state: " +
            users.find((user) => user.socketid === room.users[i])
              ?.vegetativeState
        );
      }

      //check users in vegetative state
      let numVegetative = 0;
      for (let i = 0; i < room.users.length; i++) {
        if (
          users.find((user) => user.socketid === room.users[i])?.vegetativeState
        ) {
          numVegetative++;
        }
      }

      console.log(
        "num vegetative in checkSessionLoaded fucntion: " + numVegetative
      );

      //combine sessionLoaded and vegetative state
      if (room.sessionLoaded.length + numVegetative === room.users.length) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function removeAllUsers(roomid, rooms, users) {
  //remove all users from users who are in roomid
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      for (let i = 0; i < room.users.length; i++) {
        let index = users.findIndex((user) => user.socketid === room.users[i]);
        if (index !== -1) {
          users.splice(index, 1);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function getResponseTimesTillQuestion(roomid, questionIndex, socketid, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      if (room.responseTimes[socketid]) {
        let responseTimes = [];
        for (let i = 0; i < questionIndex; i++) {
          responseTimes.push(room.responseTimes[socketid][i]);
        }
        return responseTimes;
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function getFinalResponseTimes(roomid, socketid, rooms) {
  try {
    let room = getRoom(roomid, rooms);
    if (room) {
      if (room.responseTimes[socketid]) {
        return room.responseTimes[socketid];
      }
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getRoom,
  getRoomIndex,
  addUserToRoom,
  getPlayerNum,
  setScores,
  removeUserFromRoom,
  removeRoom,
  makeid,
  getRoomQuiz,
  setRoomQuiz,
  setQuestionTimeOut,
  setRoomMaxPlayers,
  setQuestionsPerReport,
  setRoomMusicAndBgColor,
  getRoomMaxPlayers,
  setRoomCurrentQuestion,
  getRoomCurrentQuestion,
  setRoomDisplayQuestion,
  handleAnswer,
  checkAllAnswered,
  checkFirstToAnswer,
  getPeopleWhoAnswered,
  getScoresTillQuestion,
  getFinalScores,
  getRoomMusicAndBgColor,
  setUser,
  setDummyUser,
  removeName,
  getName,
  getAllUsers,
  reconnectionInit,
  lateConnectionInit,
  checkSessionLoaded,
  removeAllUsers,
  getResponseTimesTillQuestion,
  getFinalResponseTimes,
};
