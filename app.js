const server = require("./modules/server");
const db = require("./modules/db");

/**
* Connect to Database, insert default user and start API server
*/
db.connect()
 .then(db => {
   let collection = db.collection("User");
   collection.countDocuments().then(res => {
     if (res === 0) {
       collection
         .insertOne({
           login: "test",
           password: "test",
           firstName: "Nuno",
           lastName: "trop long",
           email: "",
           phoneNumber: ""
         })
         .catch(err => {
           console.log("[App] Unable to insert default user");
         });
     }
   });
 })
 .then(server.start);
