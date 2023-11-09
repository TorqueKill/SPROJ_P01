//store states for user

import { writable } from 'svelte/store';

//{id: socketid, isHost: false, quiz: {}, score: {}}

export const user = writable({ id: '', isHost: false, quiz: [], score: {}, gameid: '' });
