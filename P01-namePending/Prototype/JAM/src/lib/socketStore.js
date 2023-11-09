// @ts-nocheck
// socketStore.js
import { writable } from 'svelte/store';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

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

// Export the socket connection for reuse
export { socket };
