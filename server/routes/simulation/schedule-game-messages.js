var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');
var socket = require('../../lib/socket');
var schedule = require('node-schedule');
var io = process.io; 
// var app = require('../../../server/app.js');

var send_message_for_user = function(msg,io){
    model.game_plan_template.findOne({ where: { id: msg.gamePlanTemplateId },
        attributes: ['id', 'roles'] })
    .then(function (gamePlanTemplate) {
        msg.assigned_game_message.roles.forEach(function (msgRole) {
            gamePlanTemplate.roles.forEach(function (gameRole) {
                if(gameRole.id == msgRole.id){
                    var data = {
                        data: msg,
                        action: 'sent'
                    }
                    io.emit('game_plan_template_messages:' + msg.gamePlanTemplateId + '/' + gameRole.playerId,data)
                }
            });
        });
    });
}


var j = schedule.scheduleJob('01 * * * * *', function(){
    model.template_plan_message.findAll({
        where: {activated: false,skip : false,isDeleted:false},
        attributes: ['id', 'setOffTime', 'activatedAt']
    }).then(function(msgs) {
        msgs.forEach(function(msg) {
            if(new Date(msg.setOffTime).getFullYear() == new Date().getFullYear() &&
               new Date(msg.setOffTime).getMonth() == new Date().getMonth() &&
               new Date(msg.setOffTime).getDay() == new Date().getDay() &&
               new Date(msg.setOffTime).getHours() == new Date().getHours() &&
               new Date(msg.setOffTime).getMinutes() == new Date().getMinutes()
            ){
                model.template_plan_message.update({activated: true, activatedAt: new Date()}, {where: {id: msg.id}})
                .then(function(gamePlanTmplate) {
                    model.template_plan_message.findOne({
                        where: {id: msg.id},
                        include: [{ model: model.assigned_game_message,
                            attributes: ['id'],
                            include: [  { model: model.game_message},
                                { model: model.game_role,
                                    as: 'roles',
                                    require: false,
                                    foreignKey: 'assignedGameMessageId',
                                    attributes: ['id', 'name'],
                                    through: {attributes: [] }
                                }]
                        },{
                            model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
                            include:[{ model: model.game_library,
                                require: false}]
                        }]
                    }).then(function(response) {
                        var data = {
                            data: response,
                            action: 'update'
                        }
                        process.io.emit('game_plan_template_messages:' + response.gamePlanTemplateId,data)
                        send_message_for_user(response,process.io);
                    });

                });
            }
        });
    });
});


router.post('/update/:id',function(req,res,next){
    model.template_plan_message.update(req.body.data,{where: { id : req.params.id }})
    .then(function(result) {
        model.template_plan_message.findOne({
            where: {id: req.params.id},
            include: [{ model: model.assigned_game_message,
                attributes: ['id'],
                include: [  { model: model.game_message},
                    { model: model.game_role,
                        as: 'roles',
                        require: false,
                        foreignKey: 'assignedGameMessageId',
                        attributes: ['id', 'name'],
                        through: {attributes: [] }
                    }]
            },{
                model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
                include:[{ model: model.game_library,
                    require: false}]
            }]
        }).then(function(response) {
             var data = {
                data: response,
                action: 'update'
            }
            req.app.get('io').emit('game_plan_template_messages:' + response.gamePlanTemplateId,data)
            if(response.activated == true){
                send_message_for_user(response,req.app.get('io'));
            }
            res.send(response);
        });
    });

});
router.post('/update-message-off-set/:id',function(req,res,next){
    var record = req.body.data;
    model.template_plan_message.findOne({
        where: {id: req.params.id },
        include: [{ model: model.assigned_game_message,
            attributes: ['id'],
            include: [  { model: model.game_message},
                { model: model.game_role,
                    as: 'roles',
                    require: false,
                    foreignKey: 'assignedGameMessageId',
                    attributes: ['id', 'name'],
                    through: {attributes: [] }
                }]
        },{
            model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
            include:[{ model: model.game_library,
                require: false}]
        }]
    }).then(function(gameMsg) {
        var comingDate = new Date(record.setOffTime)
        var secs = gameMsg.timeleft
        if(secs <= 60){
            record.activated = true;
            record.activatedAt = new Date();
        }
        var toSave = new Date(comingDate.getTime() + secs*1000);

        record.setOffTime = toSave.toISOString();
        model.template_plan_message.update(record,{where: { id : req.params.id }})
        .then(function(result) {
            if(secs <= 60){
                model.template_plan_message.findOne({
                    where: { id : req.params.id },
                    include: [{ model: model.assigned_game_message,
                        attributes: ['id'],
                        include: [ 
                            { model: model.game_role,
                                as: 'roles',
                                require: false,
                                foreignKey: 'assignedGameMessageId',
                                attributes: ['id', 'name'],
                                through: {attributes: [] }
                            }]
                    },{
                        model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
                        include:[{ model: model.game_library,
                            require: false}]
                    }]
                })
                .then(function(rspp) {
                    var data = {
                        data: rspp.dataValues,
                        action: 'update'
                    }
                    req.app.get('io').emit('game_plan_template_messages:' + gameMsg.gamePlanTemplateId,data);
                    send_message_for_user(rspp.dataValues,req.app.get('io'));
                    res.send(rspp.dataValues);
                });  
            }else{
                res.send(result);
            }
        });
    });
});
router.get('/get/:id', function(req, res, next) {
    model.game_plan.findOne({
        where: {id: req.params.id },
        attributes: ['id', 'name', 'description', 'planDate', 'gameCategoryId'],
        include: [ { model: model.assigned_game_message,
            attributes: ['id'],
            through: { attributes: ['id', 'index'] },
            include: [  { model: model.game_message, attributes: ['id', 'name'] },
                { model: model.game_role,
                    as: 'roles',
                    require: false,
                    foreignKey: 'assignedGameMessageId',
                    attributes: ['id', 'name'],
                    through: {attributes: [] }
                }
            ]
        }
        ]
    }).then(function(gamePlan) {
        res.send(gamePlan);
    });
});

router.get('/all', function(req, res, next) {
    model.game_plan.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [['name', 'ASC']],
        include: [{model: model.game_category, attributes: ['name']}]
    }).then(function(result) {
        res.send(result);
    });
});


router.post('/create', function(req, res, next) {
    var record = req.body.data;
    console.log(req.body);
    record.userAccountId = req.user.userAccountId;
    model.game_plan_template.create(record)
        .then(function(gamePlanTmplate) {
            model.game_plan_template.findOne({
                where: {id: gamePlanTmplate.id},
                attributes: ['id', 'scheduled_date', 'roles', 'createdAt'],
                order: [['createdAt', 'DESC']],
                include: [{model: model.organization, attributes: ['id', 'name']},
                    {model: model.user_accounts, attributes: ['id', 'organizationName']},
                    {model: model.game_plan, attributes: ['id', 'name']}]
            }).then(function(result) {
                res.send(result);
            });
        });
});
router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.template_plan_message.create(record)
        .then(function(msg) {
            model.template_plan_message.findOne({
                where: { id : msg.id },
                include: [{ model: model.assigned_game_message,
                    attributes: ['id'],
                    include: [ 
                        { model: model.game_role,
                            as: 'roles',
                            require: false,
                            foreignKey: 'assignedGameMessageId',
                            attributes: ['id', 'name'],
                            through: {attributes: [] }
                        }]
                },{
                    model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
                    include:[{ model: model.game_library,
                        require: false}]
                }]
            })
            .then(function(rspp) {
                var data = {
                    data: rspp.dataValues,
                    action: 'save'
                }
                req.app.get('io').emit('game_plan_template_messages:' + msg.gamePlanTemplateId,data);
                send_message_for_user(rspp.dataValues,req.app.get('io'));
                res.send(rspp.dataValues);
            });  


        });
});


router.post('/create-batch', function(req, res, next) {
    var templatePlanMessages = [];
    _.each(req.body, function (templatePlanMessage) {
        templatePlanMessage.userAccountId = req.user.userAccountId;
        templatePlanMessages.push(model.template_plan_message.create(templatePlanMessage));
    });

    Q.allSettled(templatePlanMessages).then(function (resp) {
        templatePlanMessages = _.map(resp, function (t) { return t.value });
        res.send(templatePlanMessages);
    });
});

router.post('/send-message/:id', function(req, res, next) {
    var roleUsers = req.body;
    model.template_plan_message.update({activated: true, activatedAt: new Date()}, {where: {id: req.params.id}})
        .then(function(gamePlanTmplate) {
            model.template_plan_message.findOne({
                where: {id: req.params.id},
                include: [{ model: model.assigned_game_message,
                    attributes: ['id'],
                    include: [  { model: model.game_message},
                        { model: model.game_role,
                            as: 'roles',
                            require: false,
                            foreignKey: 'assignedGameMessageId',
                            attributes: ['id', 'name'],
                            through: {attributes: [] }
                        }]
                },{
                    model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
                    include:[{ model: model.game_library,
                        require: false}]
                }]
            }).then(function(response) {
                var data = {
                    data: response,
                    action: 'sent'
                }
                req.app.get('io').emit('game_plan_template_messages:' + response.gamePlanTemplateId,data)
                send_message_for_user(response,req.app.get('io'));
                res.send(response);
            });
        });
});


router.get('/get-for-game/:gamePlanTemplateId', function(req, res, next) {
    model.template_plan_message.findAll({
        where: {gamePlanTemplateId: req.params.gamePlanTemplateId,isDeleted:false},
        // order: [['name', 'ASC']],
        include: [{ model: model.assigned_game_message,
            attributes: ['id'],
            include: [
                { model: model.game_role, as: 'roles', require: false,
                    foreignKey: 'assignedGameMessageId', attributes: ['id', 'name'],
                    through: { attributes: [] }}]

        },
        {model: model.game_message}
        ]
    }).then(function(result) {
        res.send(result);
    });
});

router.delete('/remove/:id', function(req, res, next) {
    model.game_plan.destroy({where: {id: req.params.id}})
        .then(function(resp) {
            res.json({message: "Success"});
        });
});
router.delete('/delete/:id', function(req, res, next) {
    model.template_plan_message.findOne({ where: { id: req.params.id },
        attributes: ['id', 'gamePlanTemplateId'] })
    .then(function (msg) {
        model.template_plan_message.destroy({where: {id: req.params.id}})
        .then(function(response) {
            var data = {
                data: req.params.id,
                action: 'delete'
            }
            req.app.get('io').emit('game_plan_template_messages:' + msg.gamePlanTemplateId,data)
            res.send({success:true, msg: response.toString()});
        },function(response){
            model.template_plan_message.update({isDeleted:true},{where: {id: req.params.id}})
            .then(function(response) {
                var data = {
                    data: req.params.id,
                    action: 'delete'
                }
                req.app.get('io').emit('game_plan_template_messages:' + msg.gamePlanTemplateId,data)
                res.send({success:true, msg: response.toString()});
            })
        });
    });
});


router.get('/my-messages/:gamePlanTemplateId/:userId', function(req, res, next) {
    model.game_plan_template.findOne({ where: { id: req.params.gamePlanTemplateId },
        attributes: ['id', 'scheduled_date', 'roles'],
        include: [{ model: model.game_plan, attributes: ['id', 'name'] },
        { model: model.incident, attributes: ['id', 'name'] }] })
        .then(function (gamePlanTemplate) {
            if(gamePlanTemplate){
                var roles = [];
                _.each(gamePlanTemplate.roles, function (role) {
                    if(role.playerId == req.params.userId){
                       model.game_role.findOne({
                            where : { id: role.id },
                            attributes: ['id','gamePlanId', 'name', 'description'],
                            include: [{ 
                                model: model.game_plan_team, 
                                attributes: ['id', 'name']
                            }]
                        }).then(function(gameRole){
                            gameRole.playerId = role.playerId;
                            roles.push(gameRole);
                        });
                    }
                });
            }
            else{
                return res.status(380).json({success: false,message: "Game not found"});
            }
            delete gamePlanTemplate.roles;
            gamePlanTemplate.roles = roles;
            
            model.template_plan_message.findAll({
                where: {activated: true, gamePlanTemplateId: req.params.gamePlanTemplateId,isDeleted:false},
                attributes: ['id', 'setOffTime', 'activatedAt'],
                include: [{ model: model.assigned_game_message,
                    attributes: ['id'],
                    require: false,
                    include: [
                        { model: model.game_role, as: 'roles', require: true,
                            foreignKey: 'assignedGameMessageId', attributes: ['id', 'name'],
                            through: { attributes: [] }}]
                },
                { model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
                    include:[{ model: model.game_library,
                        require: false}]}]
            }).then(function(scheduledMessages) {
                scheduledMessages = scheduledMessages.map(function(res){ return res.toJSON() });

                var myMessages = [];
                _.each(scheduledMessages, function (val) {
                    var scheduledMessage = val;
                    gamePlanTemplate.roles.forEach(function (gameRole) {
                        var filteredRoleObj = scheduledMessage.assigned_game_message.roles.filter(function (role) {
                            return (gameRole.id == role.id && gameRole.playerId === req.params.userId);
                        })[0]
                        if (filteredRoleObj) {
                            scheduledMessage.role = filteredRoleObj;
                            myMessages.push(scheduledMessage);
                        }
                    });
                });
                res.send({gamePlanTemplate: gamePlanTemplate, myMessages: myMessages});
            });
        });
});

module.exports = router;
