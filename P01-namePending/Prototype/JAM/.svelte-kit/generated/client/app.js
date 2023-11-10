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
	() => import('./nodes/11')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/CreateQuiz": [3],
		"/HostOrPlayer": [4],
		"/PlayerChangesName": [5],
		"/PlayerJoins": [6],
		"/QuizQuestions": [7],
		"/QuizTitle": [8],
		"/SearchQuiz": [9],
		"/ViewHistory": [10],
		"/WaitingLobby": [11]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';