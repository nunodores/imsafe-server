var express = require('express');
const router = express.Router();
const db = require('../modules/db');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


/* GET users listing. */
router.get("/", function(req, res) {
  db.db
    .collection("User")
    .find()
    .toArray()
    .then(all_items => {
      res.json(all_items);
    })
    .catch(err => {
      console.log("Error within get alerts:", err);
    });
});

// Get a user by login
router.get('/:id', function(req, res, next) {
  console.log(req.params.id)
  db.db
    .collection("User")
    .findOne({login: req.params.id})
    .then(item => {
      delete item.password;
      res.json(item);
    })
    .catch(err => {
      console.log("Error within get alerts:", err);
    });
})


router.post('/register', function(req, res) {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
      if(err){
          res.status(500).send(err);
      } else {
          db.db.collection('User').insertOne({login: req.body.login,
              password: hash, firstName: req.body.firstName, 
              lastName: req.body.lastName, email: req.body.email,
              uuid: req.body.uuid}).then((result) => {
              req.body._id = result.insertedId;
              delete req.password;
              res.json(req.body);
          }).catch((err) => {
              res.status(500).send(err);
          });
      }
  })
});

router.post("/login", function(req, res) {
  db.db.collection("User")
    .findOne({login: req.body.login})
    .then(document => {
      if(document){
        bcrypt.compare(req.body.password, document.password, function(err, res2){
          if(res2){
              const exp = Date.now() + 12 * 60 * 60 * 1000;
              var token = jwt.sign({ id: document._id }, 'jwtsecret', { expiresIn: exp });
              res.json({token: token, login: req.body.login});
          } else {
            res.status(500).send(err);
          }
        });
      } else {
        res.status(500).send(err);
      }
    })
    .catch(err => {
      console.log("Error within /users/login:", err);
      res.status(500).send(err)
    });
});

module.exports = router;
