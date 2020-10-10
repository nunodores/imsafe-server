var express = require('express');
const router = express.Router();
const db = require('../modules/db');
//const bcrypt = require('bcrypt');
//var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/update', function(req, res) {
    console.dir(req.body);

   /*  db.db.collection('Location').replaceOne({uuid: req.body.uuid} ,{uuid: req.body.uuid, lat: req.body.lat,
        lon: req.body.lon}).then((result) => {
        req.body._id = result.insertedId;
        delete req.password;
        res.json(req.body);
    }).catch((err) => {
        res.status(500).send(err);
    }); */

    res.json({"safe_level": 2});

});


module.exports = router;
