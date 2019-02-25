var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var Q = require('q');

router.get('/get/:id', function(req, res, next) {
    model.chapter.findOne({
        where: {id: req.params.id }
    }).then(function(chapt) {
        res.send(chapt);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    model.chapter.create(record).then(function (chap) {
        res.send(chap);
    });
});

module.exports = router;
