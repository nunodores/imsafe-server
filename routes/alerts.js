var express = require('express');
const router = express.Router();
const db = require('../modules/db');

/* GET alerts listing. */
router.get("/", function(req, res) {
    db.db
      .collection("Alert")
      .find()
      .toArray()
      .then(all_items => {
        res.json(all_items);
      })
      .catch(err => {
        console.log("Error within get alerts:", err);
      });
});


// DELETE /alerts/:id  : delete an alert document by id
router.delete('/:id', function(req, res, next) {
    db.db.collection('Alert').findOneAndDelete({_id: new db.ObjectID(req.params.id)}).then((result2) => {
        if (result2.value) {
            res.json(result2.value)
        } else {
            res.status(404).send()
        }
	}).catch((err) => {
		res.status(500).send(err)
	});
});

// PUT /alerts/:id : Update an alert document
router.put('/:id', function(req, res, next) {
	delete req.body._id;
	db.db.collection('Alert').findOneAndUpdate({_id: new db.ObjectID(req.params.id)}, {$set: req.body}, {returnOriginal: false}).then((result) => {
		if (result.value) {
			res.json(result.value)
		} else {
			res.status(404).send()
		}
	}).catch((err) => {
		res.status(500).send(err)
	});
});

// Insert a quote
router.post('/', function(req, res, next) {
	db.db.collection('Alert').insertOne(req.body).then((result) => {
		req.body._id = result.insertedId
		res.json(req.body)
	}).catch((err) => {
		res.status(500).send(err)
	});
});

module.exports = router;