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
});


module.exports = router;
