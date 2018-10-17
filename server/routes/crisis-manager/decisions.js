var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get', function(req, res, next) {
    model.decision.findAll({
        where: {actionPlanId: req.query.id, status: true,isDeleted: false},
        include: [{
            model: model.user,
            require: false,
            as: 'response_actor',
            attributes: ['firstName', 'lastName', 'email']
        }]}).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.decision.findAll({where:
        {
            userAccountId: req.user.userAccountId,
            isDeleted: false,
            status: true
        }
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/bulk-save', function(req, res, next) {
    var record = req.body.data;
    record.userId = req.user.id;
    record.userAccountId = req.user.userAccountId;
    if(record.id !== undefined) {
        model.decision.update(record, {where: {id : record.id }}).then(function(response) {
        });
    }
    else {
        model.decision.create(record).then(function(response) {
        });
    }
    res.send("Successful");
});

router.post('/update', function(req, res, next) {
    model.decision.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});

module.exports = router;
