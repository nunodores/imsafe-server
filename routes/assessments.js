// manage assessments between a user and an alert
var express = require('express');
const router = express.Router();
const db = require('../modules/db');

// Get an array of assessments for an alert
router.get('/:id', function(req, res, next) {
    console.log(req.params.id)
    db.db
      .collection("Assessment")
      .find({alert_id: req.params.id})
      .toArray()
      .then(all_items => {
        res.json(all_items);
      })
      .catch(err => {
        console.log("Error within get alerts:", err);
      });
})

// DELETE /alerts/:id  : delete an alert document by id
router.delete('/:id', function(req, res, next) {
    db.db.collection('Assessment').findOneAndDelete({_id: new db.ObjectID(req.params.id)}).then((result2) => {
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
    req.body.last_update = new Date(Date.now()).toString();
	db.db.collection('Assessment').findOneAndUpdate({_id: new db.ObjectID(req.params.id)}, {$set: req.body}, {returnOriginal: false}).then((result) => {
		if (result.value) {
			res.json(result.value)
		} else {
			res.status(404).send()
		}
	}).catch((err) => {
		res.status(500).send(err)
	});
});

// Insert an alert
router.post('/', function(req, res, next) {
    
    db.db.collection('Assessment').find({user_uuid: req.body.user_uuid, alert_id: req.body.alert_id}).toArray().then(result => {
        if(result.length==0) {
            db.db.collection('Assessment').insertOne(req.body).then((result) => {
                req.body._id = result.insertedId
                res.json(req.body)
            }).catch((err) => {
                res.status(500).send(err)
            });
        } else {
            res.status(404).send()
        }
    }).catch((err) => {
        res.status(500).send(err)
    });
});


module.exports = router;