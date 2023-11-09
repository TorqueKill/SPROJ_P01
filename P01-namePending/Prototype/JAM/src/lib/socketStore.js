// @ts-nocheck
// socketStore.js
import { writable } from 'svelte/store';
import { io } from 'socket.io-client';

const socket = io(
	process.env.SERVER_LINK || 'https://boiling-beyond-93888-265de2b70712.herokuapp.com/'
);

// Create a writable store for handling events
export const socketEvents = writable({});

// Listen for events and update the store
socket.on('room-created', (roomid) => {
	socketEvents.update(() => ({ roomCreated: roomid }));
});

socket.on('user-joined', (socketid, playerNum) => {
	socketEvents.update(() => ({ roomJoined: { id: socketid, num: playerNum } }));
});

socket.on('user-left', (socketid, playerNum) => {
	socketEvents.update(() => ({ roomLeft: { id: socketid, num: playerNum } }));
});

socket.on('room-full', () => {
	socketEvents.update(() => ({ roomFull: true }));
});

socket.on('game-start', (quiz) => {
	socketEvents.update(() => ({ gameStarted: quiz }));
});

socket.on('next-question', (question) => {
	socketEvents.update(() => ({ nextQuestion: question }));
});

socket.on('final-scores', (scores) => {
	socketEvents.update(() => ({ finalScores: scores }));
});

socket.on('game-end', () => {
	socketEvents.update(() => ({ gameEnd: true }));
});

// Export the socket connection for reuse
export { socket };
