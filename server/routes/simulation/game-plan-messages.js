var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/get', function(req, res, next) {
    model.game_message.findOne({
        where: {id: req.query.id}}).then(function(references) {
        res.send(references);
    });
});

router.get('/get-plan-messages/:gamePlanId', function(req, res, next) {
    model.game_plan_message.findAll({
        where: {gamePlanId: req.params.gamePlanId,isDeleted:false}}).then(function(gamePlanMessages) {
        res.send(gamePlanMessages);
    });
});

router.get('/all', function(req, res, next) {
    model.game_message.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [['name', 'ASC']],
        include:[
            {
                model: model.game_library,
                attributes: ["id", "title", "filename"]
            }
        ]
    }).then(function(result) {
        res.send(result);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;

    model.game_plan_message.create(record)
        .then(function(gamePlanMessage) {
            res.send(gamePlanMessage);
        });
});

router.post('/update', function(req, res, next) {
    model.game_message.update(req.body.data, {where: { id : req.body.data.id }})
        .then(function(references) {
            res.send(references);
        });
});

router.post('/update-index', function(req, res, next) {
    var record = req.body.data;
    model.game_plan_message.update({index: record.index}, { where: { gamePlanId : record.gamePlanId, assignedGameMessageId: record.assignedGameMessageId } })
        .then(function(gamePlanMessage) {
            res.send(gamePlanMessage);
        });
});


router.delete('/remove/:id', function(req, res, next) {
    model.game_plan_message.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.game_plan_message.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        });
    });
});

module.exports = router;
