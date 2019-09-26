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
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use(session({
   secret: "socialNetwork",
   resave: true,
   saveUninitialized: true
}));




// Home page
app.get("/", function(req,res) {
   res.render("pages/home", {user: req.session.user});
});

// user page
app.get("/user/:username", function(req,res) {
   sql.getUser(req.params.username, function(user) {
      console.log("app get user: " + user);
      if(user != null) {
         sql.getUsersRecentPosts(req.params.username, function(results) {
            //console.log("results: " + results[0]);
            if(results != null) {
               res.render("pages/user", {user: user, posts: results});
            } else {
               res.render("pages/user", {user: user, posts: null});
            }
         });

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
      res.render("pages/login", {user: req.session.user});
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
// Logout
app.get("/logout", function(req,res) {
   if(req.session.user) {
      res.render("pages/logout");
   } else {
      res.redirect("../login");
   }
});
app.post("/logout", function(req,res) {
   req.session.destroy();
   res.redirect("/");
});


// Register page
app.get("/register", function(req,res) {
   if(req.session.user) {
      res.send("Already logged in <a href='/'>Home</a>");

   } else {
      res.render("pages/register");
   }
});
app.post("/register", function(req,res) {
   sql.checkUserExists(req.body.username, function(exists) {
      if(exists) {
         res.send("Username already exists, please pick another <a href='/register'>Home</a>");
      } else {
         res.send("Data recived");
         sql.createUser(req.body.username, tools.hash(req.body.password));
      }
   });
});

app.get("/loginCheck", function(req,res) {
   res.send("Username: " + req.session.user.username);
});

app.get("/admin", function(req,res) {
   res.render("pages/admin");
});

app.get("/post/:postid", function(req,res) {
   sql.getPost(req.params.postid, function(post) {
      if(post != null) {
         res.render("pages/post", {user: req.session.user, postData: post});
         //res.send(post);
      } else {
         res.send("Post does not exist");
      }
   });

});

app.get("/test", function(req,res) {
   res.render("pages/template");
});



// + req.body.username
