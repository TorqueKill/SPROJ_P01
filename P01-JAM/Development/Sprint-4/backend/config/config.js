const MAX_PLAYERS_PER_LOBBY = 10;
const MIN_PLAYERS_PER_LOBBY = 2;
const TIME_PER_QUESTION = 30; //seconds
const LAG_BIAS = 3; //seconds
const DEFAUL_PLAYER_NAME = "Player";
const REPORT_DISPLAY_TIME = 10;
const QUESTION_TITLE_TIME = 5; //seconds

let devAccounts = [
  {
    username: "dev1",
    password: "dev123",
    email: "test1@dev",
    id: 1,
    other: {},
  },
  {
    username: "dev2",
    password: "dev123",
    email: "test2@dev",
    id: 2,
    other: {},
  },
  {
    username: "dev3",
    password: "dev123",
    email: "test3@dev",
    id: 3,
    other: {},
  },
];

const dotenv = require("dotenv");
dotenv.config();

//export the constants

module.exports = {
  MAX_PLAYERS_PER_LOBBY: MAX_PLAYERS_PER_LOBBY,
  MIN_PLAYERS_PER_LOBBY: MIN_PLAYERS_PER_LOBBY,
  TIME_PER_QUESTION: TIME_PER_QUESTION,
  LAG_BIAS: LAG_BIAS,
  DEFAUL_PLAYER_NAME: DEFAUL_PLAYER_NAME,
  REPORT_DISPLAY_TIME: REPORT_DISPLAY_TIME,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  PORT: process.env.PORT,
  DEV_ACCOUNTS: devAccounts,
};
