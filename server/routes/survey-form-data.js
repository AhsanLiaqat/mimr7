var express = require('express');
var router = express.Router();
var model = require('../models');

router.get('/list', function(req, res, next) {
	model.survey_form_data.findAll({
		attributes: ['name', 'description']
	}).then(function(response) {
		res.send(response);
	});
});

router.post('/list', function(req, res, next) {
	model.survey_form_data.findAll({
		where: req.body,
		order: [['createdAt', 'ASC']]
	}).then(function(response) {
		res.send(response);
	});
});

router.post('/save', function(req, res, next) {
	model.survey_form_data.create(req.body).then(function(response) {
		var data = {
            data: response,
            action: 'survey_submission'
        }
        process.io.emit('survey_summary_page:' + response.contentPlanTemplateId,data)
		res.send(response);
	});
});


module.exports = router;
