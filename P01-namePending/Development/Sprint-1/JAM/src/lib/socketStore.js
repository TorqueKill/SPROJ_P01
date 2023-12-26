// @ts-nocheck
// socketStore.js
import { writable } from "svelte/store";
import { io } from "socket.io-client";

const socket = io(
  //process.env.SERVER_LINK ||
  //"https://boiling-beyond-93888-265de2b70712.herokuapp.com/"
  "http://localhost:3001"
);

// Create a writable store for handling events
export const roomEvents = writable({});
export const gameEvents = writable({});

// Listen for events and update the store
socket.on("room-created", (roomid) => {
  roomEvents.update(() => ({ roomCreated: roomid }));
});

socket.on("user-joined", (socketid, playerNum, names) => {
  roomEvents.update(() => ({
    roomJoined: { id: socketid, num: playerNum, names: names },
  }));
});

socket.on("user-left", (socketid, playerNum, names) => {
  roomEvents.update(() => ({
    roomLeft: { id: socketid, num: playerNum, names: names },
  }));
});

socket.on("room-full", () => {
  roomEvents.update(() => ({ roomFull: true }));
});

socket.on("game-start", (quiz) => {
  roomEvents.update(() => ({ gameStarted: quiz }));
});

socket.on("next-question", (question) => {
  console.log("next question");
  gameEvents.update(() => ({ nextQuestion: question }));
});

socket.on("final-scores", (scores) => {
  roomEvents.update(() => ({ finalScores: scores }));
});

socket.on("game-end", () => {
  roomEvents.update(() => ({ gameEnd: true }));
});

socket.on("reconnect", (data) => {
  console.log("reconnect");
  roomEvents.update(() => ({ reconnect: data }));
});

socket.on("room-deleted", () => {
  roomEvents.update(() => ({ roomDeleted: true }));
});

socket.on("timeout", (question) => {
  console.log("timeout");
  gameEvents.update(() => ({ timeout: question }));
});

socket.on("scores-till-question", (scores, display_time) => {
  console.log("scores-till-question");
  gameEvents.update(() => ({
    scoresTillQuestion: scores,
    display_time: display_time,
  }));
});

// socket.on

// Export the socket connection for reuse
export { socket };
