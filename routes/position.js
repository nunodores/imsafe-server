var express = require('express');
const router = express.Router();
const db = require('../modules/db');
//const bcrypt = require('bcrypt');
//var jwt = require('jsonwebtoken');

/* GET locations listing. */
router.get('/', function(req, res, next) {
    db.db
      .collection("Location")
      .find()
      .toArray()
      .then(all_items => {
        res.json(all_items);
      })
      .catch(err => {
        console.log("Error within get alerts:", err);
      });
});

router.post('/update', function(req, res) {
    db.db.collection('Location').replaceOne({uuid: req.body.uuid} ,{uuid: req.body.uuid, lat: req.body.lat,
        lon: req.body.lon}).then((result) => {
            if(result) {
                req.body._id = result.insertedId;
                res.json(req.body);
            } else {
                res.status(500).send(err);
            }
    }).catch((err) => {
        res.status(500).send(err);
    }); 

});


module.exports = router;
