const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const sql = require("./sqlQueries.js");
const tools = require("./tools.js");

const port = 80; // the port the server listens for
app.listen(port);

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DATABASE SETUP
const db = mysql.createConnection({ // Establishes connection with the database
  host: 'localhost',
  user: 'root',
  password: "Sid_skater10",
  database: "socialnetworkdb"
});
db.connect( function(err) { // Tests connection with the database
   if(err) { // test for error
      console.error("Error connectiong: " + err.stack);
      return;
   }
   console.log("Connected to db");
});


// Home page
app.get("/", function(req,res) {
   res.render("home");
});

// user page
app.get("/user/:username", function(req,res) {
   // Querys database for the username in the url
   db.query(`SELECT * FROM socialnetworkdb.user WHERE username = '${req.params.username}'`, function(error, results, fields) {
      if(error)  { // checks for error with the query
         console.error("db error");
      }
      if(results.length < 1) {
         res.send("User doesn't exist");
      } else {
         res.send(results[0]);
      }
   });
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
