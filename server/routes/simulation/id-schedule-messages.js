var express = require('express');
var router = express.Router();
var model = require('../../models');
var socket = require('../../lib/socket');
var schedule = require('node-schedule');

var j = schedule.scheduleJob('05 * * * * *', function(){
    model.id_schedule_message.findAll({
        where: {activated: false,skip: false,isDeleted:false},
        include: [
            { model: model.id_schedule_game,
                include: [
                    { model: model.incident}
                    ]
            }
            ]
    }).then(function(msgs) {
        msgs.forEach(function(msg) {
            if(new Date(msg.setOffTime).getFullYear() == new Date().getFullYear() &&
               new Date(msg.setOffTime).getMonth() == new Date().getMonth() &&
               new Date(msg.setOffTime).getDay() == new Date().getDay() &&
               new Date(msg.setOffTime).getHours() == new Date().getHours() &&
               new Date(msg.setOffTime).getMinutes() == new Date().getMinutes()
            ){
                model.id_schedule_message.update({activated: true, activated_At: new Date()}, {where: {id: msg.id}})
                .then(function(gamePlanTmplate) {
                    model.id_schedule_message.findOne({
                        where : {id : msg.id},
                        include: [
                            { model: model.id_schedule_game,
                                include: [
                                    { model: model.incident}
                                    ]
                            }]
                    }).then(function(find){
                        var data = {
                            userId: msg.userId,
                            message: msg.message,
                            status: 'Incoming',
                            incidentId: msg.id_schedule_game.incident.id,
                        };
                        model.message.create(data).then(function(message) {
                            model.message.findOne({
                                where: {id: message.id},
                                include: {
                                    model: model.user,
                                    as: 'user',
                                    attributes: ['firstName', 'lastName', 'id']
                                }
                            }).then(function(msg) {
                                var messageResponse = {
                                    data: msg,
                                    action: 'new'
                                }
                                process.io.emit('incoming_message:' + message.incidentId,messageResponse)
                                var msgCoach = {
                                    data: find,
                                    action: 'update'
                                }
                                process.io.emit('information_simulation_active_game:' + find.idScheduleGameId,msgCoach)

                            });
                        });
                    });
                });
            }
        });
    });
});

router.get('/detail-information-manager-game/:id', function(req, res, next) {
    model.id_schedule_game.findOne({
        where: {id: req.params.id},
        include: [
            {model: model.incident},
            {model: model.id_game},
            {model : model.id_schedule_message, attributes: ['id', 'message','setOffTime','offset','activated_At','skip','activated']}]
    }).then(function(response) {
        res.send(response);
    });
});


router.get('/get', function(req, res, next) {
    model.id_schedule_message.findOne({
        where: {id: req.query.id}}).then(function(response) {
            res.send(response);
    });
});


router.get('/all', function(req, res, next) {
     model.id_schedule_message.findAll({
        where: {
            userAccountId: req.user.userAccountId,isDeleted:false},
            include: [
            { model: model.id_game}
                        ]
     }).then(function(response) {
            res.send(response);
        });
});

router.post('/create', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.id_schedule_message.create(record).then(function(response) {
        res.send(response);
    });
});

router.put('/update/:id', function(req, res, next) {
    model.id_schedule_message.update(req.body, {where: { id : req.params.id }}).then(function(response) {
        model.id_schedule_message.findOne({where : {id : req.params.id},
            include: [
            { model: model.id_schedule_game,
                include: [
                    { model: model.incident}
                    ]
            }
            ]}).then(function(respp){
            if(req.body && req.body.activated){
                var data = {
                    userId: respp.userId,
                    message: respp.message,
                    status: 'Incoming',
                    incidentId: respp.id_schedule_game.incident.id,
                };
                model.message.create(data).then(function(message) {
                    model.message.findOne({
                        where: {id: message.id},
                        include: {
                            model: model.user,
                            as: 'user',
                            attributes: ['firstName', 'lastName', 'id']
                        }
                    }).then(function(msg) {
                        var io = req.app.get('io');
                        var xresp = {
                            data: msg,
                            action: 'new'
                        }
                        io.emit('incoming_message:' + message.incidentId,xresp)
                        var msg = {
                            data: respp,
                            action: 'update'
                        }
                        io.emit('information_simulation_active_game:' + respp.idScheduleGameId,msg)
                        res.send(respp);
                    });
                });
            }else{
                var io = req.app.get('io');
                var msg = {
                    data: respp,
                    action: 'update'
                }
                io.emit('information_simulation_active_game:' + respp.idScheduleGameId,msg)
                res.send(respp);
            }
        });
    });
});
router.delete('/remove/:id?', function(req, res, next) {
    model.id_schedule_message.findOne({where: {id: req.params.id}}).then(function(item) {
        item.destroy().then(function(response) {
            res.send({success:true, msg:response.toString()});
        },function(response){
            item.update({isDeleted:true}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            })
        });
    });
});

module.exports = router;
