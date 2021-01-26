/*
1.express is used to create restApi based application.
2.First we need to create the express server.
3.Then we need to start the server over the specific port.
4.we can use api using postman or in ur client application.
*/

// load module and create server
const express = require("express");
const users = require('./api/users')
const profile = require("./api/profile");
const post = require("./api/post");
const comments = require("./api/comments");
const mongoose = require('mongoose')
const db = require("./config/dbConfig").mongoURI;
const bodyParser = require("body-parser");


const app = express();


//passport spec
const passport = require("passport")


//apply body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //it will convert all ur body content  to json object implicity

//connection to mongodb
mongoose
  .connect(db)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));



//password midleware
app.use(passport.initialize())
//Password Config
require('./config/passport')(passport)
// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/post", post);
app.use("/api/comments", comments);

//we need a specific port for the communication
const port = 5000;
app.listen(port, () => {
  console.log(`server is running on port no :${port}`);
});

