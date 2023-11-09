import { io } from 'socket.io-client';

const _socket = io('http://localhost:3001');

export const socket = _socket;
