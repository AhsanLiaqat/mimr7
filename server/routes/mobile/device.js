var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.post('/save', function (req, res, next) {
    var record = req.body;
    model.device.create(record).then(function (response) {
        res.send(response);
    });
});

router.delete('/removeToken', function (req, res, next) {
    model.device.destroy({ where: { userId: req.query.id
        ,device_token: req.query.token } }).then(function (resp) {
        res.json({ message: "Success" });
    });
});

module.exports = router;
