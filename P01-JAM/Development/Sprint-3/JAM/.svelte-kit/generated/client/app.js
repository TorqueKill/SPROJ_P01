export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/CreateQuestion": [4],
		"/chooseQuiz": [3],
		"/createQuiz": [5],
		"/createRoom": [6],
		"/dummyLogin": [7],
		"/gameEnd": [8],
		"/gameSession": [9],
		"/gameStats": [10],
		"/hostOrPlayer": [11],
		"/signIn": [12],
		"/signUp": [13],
		"/viewHistory": [14],
		"/waitLobby": [15]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';