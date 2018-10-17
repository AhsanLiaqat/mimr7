var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get', function(req, res, next) {
    model.status_report.findOne({
        where: {id: req.query.id}}).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.status_report.findAll({where: {userAccountId: req.user.userAccountId,isDeleted: false},
        include: [{
            model: model.email_tracking
        }]
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/incident-report', function(req, res, next) {
    model.status_report.findAll({where: {incidentName: req.body.data.name,isDeleted: false},
        include: [{
            model: model.email_tracking
        }]
    }).then(function(response) {
        res.send(response);
    });
});


router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userId = req.user.id;
    record.userAccountId = req.user.userAccountId;
    model.status_report.findAll({where: {incidentId: req.body.data.incidentId,isDeleted: false }}).then(function(response) {
        var max = 1;
        response.forEach(function(value){
            max = Math.max(max, value.version);
        });
        record.version = max+1;
        model.status_report.create(record).then(function(response) {
            res.send(response);
        });
    });
});

router.post('/update', function(req, res, next) {
    model.status_report.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});

module.exports = router;
