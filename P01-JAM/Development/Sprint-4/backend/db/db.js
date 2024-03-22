//mongodb connection
//get the client
const { MongoClient } = require("mongodb");

let dbConnection;

let username = "muiz";
let password = "abc123abc123";

let uri = `mongodb+srv://${username}:${password}@mern.ugl3cr2.mongodb.net/JAM?retryWrites=true&w=majority&appName=MERN`;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        console.log("Connected to Database");
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },

  getDb: () => dbConnection,
};
