export const SCREENS = {
  HOME: 0,
  CREATE: 1,
  JOIN: 2,
  WAITING: 3,
  GAME: 4,
  SCORE: 5,
};

export const ROOM_SETTINGS = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 10,
  MIN_QUESTIONS_PER_REPORT: -1,
  MAX_QUESTIONS_PER_REPORT: 5,
  BG_COLORS: [
    "bg-gradient-to-br from-purple-400 via-purple-500 via-20% to-purple-900 to-80%",
    "bg-gradient-to-br from-purple-600 via-purple-800 via-20% to-purple-950 to-80%",
    "bg-gradient-to-br from-purple-400 via-violet-700 to-purple-900",
  ],
  BG_MUSIC: ["/music/1.mp3", "/music/2.mp3", "/music/3.mp3", "-1"],
};

export const DEFAULT_ROOM_SETTINGS = {
  DEFAULT_QUESTION_PER_REPORT: -1,
  DEFAULT_BG_COLOR: ROOM_SETTINGS.BG_COLORS[0],
  DEFAULT_BG_MUSIC: ROOM_SETTINGS.BG_MUSIC[ROOM_SETTINGS.BG_MUSIC.length - 1],
  DEFAULT_BG_COLOR_INDEX: 0,
  DEFAULT_BG_MUSIC_INDEX: ROOM_SETTINGS.BG_MUSIC.length - 1,
  DEFAULT_QUESTION_ON_PLAYER_SCREEN: false,
};

export const GAME_SETTINGS = {
  MAX_QUESTIONS_PER_REPORT: 5,
  MAX_TIME_PER_QUESTION: 30,
  MAX_TIME_PER_REPORT: 10,
  MAX_TIME_PER_GAME: 1800,
  LEADERBOARD_SIZE: 5,
};

export const AVATARS = [
  "man1.png",
  "woman1.png",
  "man2.png",
  "woman2.png",
  "man3.png",
  "woman3.png",
  "man4.png",
  "woman4.png",
  "man5.png",
  "woman5.png",
];

export const VALIDATION_CHECKS_AUTH = {
  email_AllowedCharacters: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  email_LengthLimit: 254,
  password_AllowedCharacters: "^[a-zA-Z0-9!@#$%^&*()_+=-]{6,20}$",
  password_LengthLimit: 20,
  password_MinLength: 8,
  password_SpecialCharacterRequired: false,
  password_UppercaseRequired: false,
  password_NumberRequired: false,
  username_AllowedCharacters: "^[a-zA-Z0-9._-]{3,20}$",
  username_LengthLimit: 20,
};

export const QUIZ_DISPLAY_PAGINATION = 13;

//1 week
export const SESSION_TIMEOUT = 604800000;

export const BACKEND_URL = "https://mysterious-retreat-98397-8a74f4ba2e1e.herokuapp.com"; // || process.env.BACKEND_URL;

export const DEPLOYED_URL_LOCAL = "http://localhost:5173";

export const DEPLOYED_URL = "https://p1-jam.vercel.app";

//https://boiling-beyond-93888-265de2b70712.herokuapp.com/

//https://mysterious-retreat-98397-8a74f4ba2e1e.herokuapp.com/
