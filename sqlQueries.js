// Imports
const mysql = require("mysql");


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


// Exported functions
module.exports = {
   // SELECT
   getUser: function(username, fn) {
      db.query(`SELECT * FROM socialnetworkdb.user WHERE username = '${username}'`, function(error, results, fields) {
         if(error)  { // checks for error with the query
            console.error("db error");
            fn(null);
         }
         if(results.length < 1) { // if no user is returned
            fn(null);
         } else { // returns first user with the same name, should only be possible to have one
            fn(results[0]);
         }
      });
   },

   // UPDATE
   updatePassword: function(username, newPasswordHash) {
      db.query(`UPDATE socialnetworkdb.user SET password_hash = 'dd4d4f9003a3c3a7ca95e26145f4a9c3' WHERE username = 'admin';`, function(error, results, fields) {
         if(error) {
            console.log("db error UPDATE, updatePassword: " + error);
            throw error;
         }
      });
   },
   // DELETE
   deleteUser: function(username) {
      db.query(`delete from socialnetworkdb.user where username = "${username}";`, function(error, results, fields) {
         if(error) {
            console.log("db error delete, deleteUser: " + error);
            throw error;
         }
      });
   },
   // INSERT
   createUser: function(username, passwordHash) {
      // console.log(`INSERT INTO socialnetworkdb.user (username, display_name, dt_created, password_hash) VALUES ("${username}", "${username}", now(), "${passwordHash}");`);
      db.query(`INSERT INTO socialnetworkdb.user (username, display_name, dt_created, password_hash) VALUES ("${username}", "${username}", now(), "${passwordHash}");`, function(error,results,fields) {
         if(error) {
            console.log("db error INSERT, createUser: " + error);
            throw error;
         }
      });
   }
}
