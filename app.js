const express = require("express");
const session = require("express-session");
const app = express();

const bodyParser = require("body-parser");
const sql = require("./sqlQueries.js");
const tools = require("./tools.js");

const port = 80; // the port the server listens for
app.listen(port);

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





// Home page
app.get("/", function(req,res) {
   res.render("home");
});

// user page
app.get("/user/:username", function(req,res) {
   sql.getUser(req.params.username, function(user) {
      if(user != null) {
         res.send(user);
      } else {
         res.send("User does not exist");
      }
   });
});

// Login page
app.get("/login", function(req,res) {
   res.render("login");
});
app.post("/login", function(req,res) {

   res.send("Data recived");

});

// Register page
app.get("/register", function(req,res) {
   res.render("register");
});
app.post("/register", function(req,res) {
   res.send("Data recived");
   sql.createUser(req.body.username, tools.hash(req.body.password));

});








// + req.body.username
