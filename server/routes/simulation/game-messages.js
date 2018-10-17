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

router.get('/get-plan-message/:id', function(req, res, next) {

    model.game_message.findAll({
        where: {userAccountId: req.user.userAccountId, gamePlanId :req.params.id,isDeleted:false},
        order: [['name', 'ASC']],
        include:[
            {
                model: model.game_library,
                attributes: ["id", "title", "filename"]
            },
            {
                model: model.assigned_game_message,
                include: [{
                    model: model.game_role,
                    as: 'roles',
                    require: false,
                    foreignKey: 'assignedGameMessageId',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    }
                }]
            }
        ]
    }).then(function(result) {
        res.send(result);
    });
});



router.get('/all', function(req, res, next) {
    model.game_message.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [['name', 'ASC']],
        include:[
            {
                model: model.game_library,
                attributes: ["id", "title", "filename","type","url"]
            },
            {
                model: model.game_plan,
                attributes: ["id", "name"]
            },
            {
                model: model.assigned_game_message,
                include: [{
                    model: model.game_role,
                    as: 'roles',
                    require: false,
                    include: [{model: model.game_plan_team,attributes: ['id', 'name']}],
                    foreignKey: 'assignedGameMessageId',
                    attributes: ['id', 'name']
                }]
            }
        ]
    }).then(function(result) {
        res.send(result);
    });
});

router.get('/un-assigned-all', function(req, res, next) {
    model.game_message.findAll({
        where: { userAccountId: req.user.userAccountId,isDeleted:false },
        order: [['name', 'ASC']],
        include: [
            { model: model.assigned_game_message },
            { model: model.game_library,
                attributes: ["id", "title", "filename"]
            }
        ]
    }).then(function(gameMessages) {
        var unassignedMessages = [];
        _.each(gameMessages, function (message) {
            if (message.assigned_game_messages.length == 0) {
                unassignedMessages.push(message);
            }
        });

        Q.allSettled(unassignedMessages).then(function (res) {
            unassignedMessages = _.map(res, function (message) { return message.value });
        });

        Q.allSettled(unassignedMessages).done(function (result) {
            res.send(unassignedMessages);
        });
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.game_message.create(record)
        .then(function(references) {
            res.send(references);
        });
});

router.post('/update', function(req, res, next) {
    model.game_message.update(req.body.data, {where: { id : req.body.data.id }})
        .then(function(references) {
            res.send(references);
        });
});


router.delete('/remove/:id', function(req, res, next) {
    model.game_message.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.game_message.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

module.exports = router;
