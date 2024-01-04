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
	() => import('./nodes/12')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/CreateQuestion": [3],
		"/createQuiz": [4],
		"/dummyLogin": [5],
		"/dummyViewHistory": [6],
		"/gameEnd": [7],
		"/gameSession": [8],
		"/hostOrPlayer": [9],
		"/signIn": [10],
		"/signUp": [11],
		"/waitLobby": [12]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';