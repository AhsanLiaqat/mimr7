var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var Q = require('q');


router.post('/save', function(req, res, next) {
    var record = req.body;
    model.answer.create(record).then(function (response) {
    	console.log('what is come',response)
    	var data = {
            data: response,
            action: 'questionAnwere'
        }
        process.io.emit('question_expired:' + response.contentPlanTemplateId,data)
        res.send(response);
    });
});

module.exports = router;
