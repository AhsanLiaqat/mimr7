var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/list', function(req, res, next) {
	model.submission.findAll({
		attributes: ['name', 'description']
	}).then(function(response) {
		res.send(response);
	});
});

router.post('/list', function(req, res, next) {
	model.submission.findAll({
		where: req.body,
		order: [['createdAt', 'ASC']]
	}).then(function(response) {
		res.send(response);
	});
});

router.post('/save', function(req, res, next) {
	model.submission.create(req.body).then(function(response) {
		res.send(response);
	});
});


module.exports = router;
