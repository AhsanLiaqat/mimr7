var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/all', function (req, res, next) {
    model.activity.findAll({
        where: { responseActorId: req.query.responseActorId },
        include: [{
            model: model.task_list,
            attributes: ['id', 'title']
        }, { model: model.user, as: 'response_actor', attributes: ['id', 'firstName', 'lastName', 'email'] }]
    }).then(function (response) {
        res.send(response);
    });
});

module.exports = router;