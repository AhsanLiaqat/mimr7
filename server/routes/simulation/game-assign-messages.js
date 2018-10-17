var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/all', function (req, res, next) {
    model.assigned_game_message.findAll({
        where: { userAccountId: req.query.userAccountId,isDeleted:false },
        include: [{
            model: model.game_message,
            attributes: ['id', 'name']
        }, {
            model: model.game_role,
            as: 'roles',
            require: false,
            foreignKey: 'assignedGameMessageId',
            attributes: ['id', 'name'],
            through: {
                attributes: []
            }
        }]
    }).then(function (response) {
        res.send(response);
    });
});

router.post('/save', function (req, res, next) {
    var record = req.body.data;
    var roles = req.body.roles;
    model.assigned_game_message.create(record)
        .then(function (assignedMessage) {
            if(roles && roles.length > 0){
                var gameRoles = [];
                _.each(roles, function (role) {
                    gameRoles.push(model.game_role.findOne({
                        where: { id: role }
                    }));
                });
                Q.allSettled(gameRoles).then(function (result) {
                    gameRoles = _.map(result, function (u) { return u.value });
                    assignedMessage.addRoles(gameRoles);

                    model.assigned_game_message.findOne({
                        where: { id: assignedMessage.id }
                    }).then(function (response) {
                        response.dataValues.roles = [];
                        gameRoles.forEach(function (role) {
                            response.dataValues.roles.push({id: role.id, name: role.name})
                        });
                        res.send(response);
                    });
                });

            }else{
                res.send(assignedMessage);
            }
        });
});

router.post('/create', function (req, res, next) {

    var record = req.body.data.assignedMessage;
    var roles = req.body.data.roles;
    model.assigned_game_message.create(record)
        .then(function (assignedMessage) {
            if(roles && roles.length > 0){
                var gameRoles = [];
                _.each(roles, function (role) {
                    gameRoles.push(model.game_role.findOne({
                        where: { id: role }
                    }));
                });
                Q.allSettled(gameRoles).then(function (result) {
                    gameRoles = _.map(result, function (u) { return u.value });
                    assignedMessage.addRoles(gameRoles);

                    model.assigned_game_message.findOne({
                        where: { id: assignedMessage.id },
                        include: [{
                            model: model.game_message,
                            attributes: ['id', 'name']
                        }]
                    }).then(function (response) {
                        response.dataValues.roles = [];
                        gameRoles.forEach(function (role) {
                            response.dataValues.roles.push({id: role.id, name: role.name})
                        });
                        res.send(response);
                    });
                });

            }else {
                model.assigned_game_message.findOne({
                    where: { id: assignedMessage.id },
                    include: [{
                        model: model.game_message,
                        attributes: ['id', 'name']
                    }, {
                        model: model.game_role,
                        as: 'roles',
                        require: false,
                        foreignKey: 'assignedGameMessageId',
                        attributes: ['id', 'name'],
                        through: {
                            attributes: []
                        }
                    }]
                }).then(function (response) {
                    res.send(response);
                });
            }
        });
});


router.post('/update', function (req, res, next) {
    var record = req.body.data.assignedMessage;
    var roles = req.body.data.roles;

    model.assigned_game_message.update(record, { where: { id: record.id } })
        .then(function (result) {

            model.assigned_game_message.findOne({
                where: { id: record.id },
                include: [{
                    model: model.game_message,
                    attributes: ['id', 'name']
                }, {
                    model: model.game_role,
                    as: 'roles',
                    require: false,
                    foreignKey: 'assignedGameMessageId',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    }
                }]
            }).then(function (assignedMessage) {
                if(roles && roles.length > 0){
                    var gameRoles = [];
                    _.each(roles, function (role) {
                        gameRoles.push(model.game_role.findOne({
                            where: { id: role }
                        }));
                    });

                    Q.allSettled(gameRoles).then(function (result) {
                        gameRoles = _.map(result, function (u) { return u.value });

                        assignedMessage.setRoles(gameRoles);

                        assignedMessage.dataValues.roles = [];

                        gameRoles.forEach(function (role) {
                            assignedMessage.dataValues.roles.push({id: role.id, name: role.name});
                        });
                        res.send(assignedMessage.dataValues);
                    });
                }else{
                    res.send(assignedMessage);
                }

            });

        });
});

router.delete('/remove', function (req, res, next) {
    model.assigned_game_message.destroy({ where: { id: req.query.id } }).then(function (response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.assigned_game_message.update({isDeleted:true},{ where: { id: req.query.id } }).then(function (response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

module.exports = router;
