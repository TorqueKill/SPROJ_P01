const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const Server = require("socket.io").Server;
const socketController = require("./socket-controller/socketManager");

// creating supabase client
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const userAuth = require("./controller/userAuth");

const _consts = require("./config/config");

const supabaseUrl = _consts.SUPABASE_URL;
const supabaseKey = _consts.SUPABASE_KEY;
const port = _consts.PORT;

const supabase = createClient(supabaseUrl, supabaseKey);

let corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
    "x-auth-token",
  ],
};

app.use(cors(corsOptions));

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use("/auth", userAuth(supabase), cors(corsOptions));

socketController(server);

server.listen(port || 3001, () => {
  if (port) {
    console.log("listening on port " + port);
  } else {
    console.log("listening on port 3001");
  }
});
