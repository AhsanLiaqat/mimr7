var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var Q = require('q');


router.post('/save', function(req, res, next) {
    var record = req.body;
    model.answer.create(record).then(function (point) {
        res.send(point);
    });
});

module.exports = router;
