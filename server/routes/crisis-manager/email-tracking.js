var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/all', function(req, res, next) {
    model.email_tracking.findAll({where: {statusReportId: req.query.id,isDeleted: false}}).then(function(response) {
        res.send(response);
    });
});
router.get('/all-team', function(req, res, next) {
    model.email_tracking.findAll({where: {userAccountId: req.query.id,isDeleted: false},
        include: [{
            model: model.user
        }]}).then(function(response) {
        res.send(response);
    });
});
router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userId = req.user.id;
    record.userAccountId = req.user.userAccountId;
    model.email_tracking.create(record).then(function(response) {
        res.send(response);
    });
});

//not in use
router.post('/update', function(req, res, next) {
    model.email_tracking.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});
//not in use
router.get('/get', function(req, res, next) {
    model.email_tracking.findOne({
        where: {id: req.query.id}}).then(function(response) {
            res.send(response);
        });
    });

module.exports = router;
