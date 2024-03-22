const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const Server = require("socket.io").Server;
const mongoose = require("mongoose");
const socketController = require("./socket-controller/socketManager");

let uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}${process.env.MONGO_URI}`;

const cors = require("cors");
const userAuth = require("./controller/userAuth");
const devRoutes = require("./controller/devAuth");

const _consts = require("./config/config");

const port = _consts.PORT;

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

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to Database");
    app.use("/dev", devRoutes, cors(corsOptions));
    app.use("/auth", userAuth(), cors(corsOptions));

    socketController(server);

    server.listen(port || 3001, () => {
      if (port) {
        console.log("listening on port " + port);
      } else {
        console.log("listening on port 3001");
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
