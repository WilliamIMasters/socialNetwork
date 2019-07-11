const express = require("express");
const session = require("express-session");
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sql = require("./sqlQueries.js");
const tools = require("./tools.js");

const port = 80; // the port the server listens for
app.listen(port);

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(cookieParser());
app.use(session({
   secret: "socialNetwork",
   resave: true,
   saveUninitialized: true
}));




// Home page
app.get("/", function(req,res) {
   res.render("home", {user: req.session.user});
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
   console.log("res.session.username: " + req.session.user);
   if(req.session.user) {
      res.send("Already logged in");
   } else {
      res.render("login", {user: req.session.user});
   }
});
app.post("/login", function(req,res) {
   if(req.body.username != null && req.body.password != null && req.body.username != "" && req.body.password != "") {

      sql.authenticateLogin(req.body.username, tools.hash(req.body.password), function(user) {
         console.log("/login . user: " + user);
         if(user != null) {
            req.session.user = user;
            res.redirect(`/user/${req.session.user.username}`);
         } else {
            res.send("Invalid password or username </br><a href='../login'>Login</a>");
         }
      });

   } else {
      res.send("<p>Invalid credentials</p> <br/> <a href='/'>Home</a>");
   }

});

// Register page
app.get("/register", function(req,res) {
   res.render("register");
});
app.post("/register", function(req,res) {
   res.send("Data recived");
   sql.createUser(req.body.username, tools.hash(req.body.password));
});

app.get("/loginCheck", function(req,res) {
   res.send("Username: " + req.session.user.username);
});

app.get("/admin", function(req,res) {
   res.render("admin");
});






// + req.body.username
