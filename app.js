const express = require("express");
const app = express();
const mysql = require('mysql');


const port = 80; // the port the server listens for
app.listen(port);

app.set("view engine", "ejs")

const db = mysql.createConnection({ // Establishes connection with the database
  host: 'localhost',
  user: 'root',
  password: "____",
  database: "socialnetworkdb"
});

db.connect( function(err) { // Tests connection with the database
   if(err) { // test for error
      console.error("Error connectiong: " + err.stack);
      return;
   }
   console.log("Connected to db");
});




app.get("/", function(req,res) { // Home page
   res.render("home");
});

app.get("/user/:username", function(req,res) { // user page
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

/*

INSERT INTO user (username, display_name, bio, dt_created, password_hash) values (
	'admin',
    'William Masters'
    'The site creator',
    dateTime.now(),
    'abcdefg'
);




*/
