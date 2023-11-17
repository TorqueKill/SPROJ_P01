// @ts-nocheck
// socketStore.js
import { writable } from "svelte/store";
import { io } from "socket.io-client";

const socket = io(
  // process.env.SERVER_LINK ||
    // "https://boiling-beyond-93888-265de2b70712.herokuapp.com/"
    "http://localhost:3001"
);

// Create a writable store for handling events
export const socketEvents = writable({});
export const socketEvents2 = writable({});

// Listen for events and update the store
socket.on("room-created", (roomid) => {
  socketEvents.update(() => ({ roomCreated: roomid }));
});

socket.on("user-joined", (socketid, playerNum, names) => {
  socketEvents.update(() => ({
    roomJoined: { id: socketid, num: playerNum, names: names },
  }));
});

socket.on("user-left", (socketid, playerNum, names) => {
  socketEvents.update(() => ({
    roomLeft: { id: socketid, num: playerNum, names: names },
  }));
});

socket.on("room-full", () => {
  socketEvents.update(() => ({ roomFull: true }));
});

socket.on("game-start", (quiz) => {
  socketEvents.update(() => ({ gameStarted: quiz }));
});

socket.on("next-question", (question) => {
  socketEvents.update(() => ({ nextQuestion: question }));
});

socket.on("final-scores", (scores) => {
  socketEvents.update(() => ({ finalScores: scores }));
});

socket.on("game-end", () => {
  socketEvents.update(() => ({ gameEnd: true }));
});

// socket.on

// Export the socket connection for reuse
export { socket };
