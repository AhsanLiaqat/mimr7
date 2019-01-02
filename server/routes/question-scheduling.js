var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var schedule = require('node-schedule');
var Q = require('q');
var mailServer = require('../lib/email');



// var send_message_for_user = function(msg,io){
//     model.content_plan_template.findOne({ where: { id: msg.gamePlanTemplateId },
//         attributes: ['id', 'roles'] })
//     .then(function (gamePlanTemplate) {
//         msg.assigned_game_message.roles.forEach(function (msgRole) {
//             gamePlanTemplate.roles.forEach(function (gameRole) {
//                 if(gameRole.id == msgRole.id){
//                     var data = {
//                         data: msg,
//                         action: 'sent'
//                     }
//                     io.emit('game_plan_template_messages:' + msg.gamePlanTemplateId + '/' + gameRole.playerId,data)
//                 }
//             });
//         });
//     });
// }


var j = schedule.scheduleJob('01 * * * * *', function(){
    model.question_scheduling.findAll({
        where: {activated: false,isDeleted:false},
        attributes: ['id', 'setOffTime', 'activatedAt']
    }).then(function(questions) {
        questions.forEach(function(msg) {
            if(new Date(msg.setOffTime).getFullYear() == new Date().getFullYear() &&
               new Date(msg.setOffTime).getMonth() == new Date().getMonth() &&
               new Date(msg.setOffTime).getDay() == new Date().getDay() &&
               new Date(msg.setOffTime).getHours() == new Date().getHours() &&
               new Date(msg.setOffTime).getMinutes() == new Date().getMinutes()
            ){
                model.question_scheduling.findOne({
                    where: {id: msg.id},
                    include: [
                    {
                        model: model.content_plan_template,
                        include:[{ model: model.player_list,
                            include:[{ model: model.user}]  
                        }]
                    }]
                }).then(function(scheduled_question) {
                    _.each(scheduled_question.content_plan_template.player_list.users, function (user){
                        var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://localhost:8082/#/pages/content-questions' + '/' + user.id + '/' + scheduled_question.id;
                        var mailOptions = {
                            from: 'noreply@crisishub.co',
                            to: user.email,
                            subject : 'not decided subject',
                            html: link
                        };
                        console.log('===============================',mailOptions)
                        mailServer.sendMail(mailOptions).then(function(response) {
                            console.log("response," ,response);
                            res.send(response);
                        }, function(err) {
                            res.send(err);
                            console.log(err, ' error');
                        });
                    });
                });
                model.question_scheduling.update({activated: true, activatedAt: new Date()}, {where: {id: msg.id}})
                .then(function(gamePlanTmplate) {
                    // model.question_scheduling.findOne({
                    //     where: {id: msg.id},
                    //     include: []
                    // }).then(function(response) {
                    //     // send_message_for_user(response,process.io);
                    // });

                });
            }
        });
    });
});




router.get('/all', function(req, res, next) {
    model.article.findAll({where: {userAccountId: req.user.userAccountId}}).then(function(users) {
        res.json(users);
    });
});

router.get('/get/:id', function(req, res, next) {
    model.question_scheduling.findOne({
        where: {id: req.params.id },
        include : [{model : model.question},
        {model : model.content_plan_template}]
    }).then(function(scheduled_question) {
        res.send(scheduled_question);
    });
});

router.post('/update-message-off-set/:id',function(req,res,next){
    var record = req.body.data;
    model.question_scheduling.findOne({
        where: {id: req.params.id },
        include: []
    }).then(function(gameMsg) {
        var comingDate = new Date(record.setOffTime)
        var secs = gameMsg.offset
        if(secs <= 60){
            record.activated = true;
            record.activatedAt = new Date();
        }
        var toSave = new Date(comingDate.getTime() + secs*1000);

        record.setOffTime = toSave.toISOString();
        model.question_scheduling.update(record,{where: { id : req.params.id }})
        .then(function(result) {
            if(secs <= 60){
                model.question_scheduling.findOne({
                where: {id: req.params.id},
                include: [
                {
                    model: model.content_plan_template,
                    include:[{ model: model.player_list,
                        include:[{ model: model.user}]  
                    }]
                }]
            }).then(function(scheduled_question) {
                // console.log('==========>>>>>>>><<<<<<<<<',scheduled_question.content_plan_template)
                // console.log('()()()()()()()()',scheduled_question.content_plan_template.player_list)
                console.log('++++++++++++++++++++++++',scheduled_question.content_plan_template.player_list.users.length)
                _.each(scheduled_question.content_plan_template.player_list.users, function (user){
                    var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://localhost:8082/#/pages/content-questions' + '/' + user.id + '/' + scheduled_question.id;
                    var mailOptions = {
                        from: 'noreply@crisishub.co',
                        to: user.email,
                        subject : 'not decided subject',
                        html: link
                    };
                    console.log('===============================',mailOptions)
                    mailServer.sendMail(mailOptions).then(function(response) {
                        console.log("response," ,response);
                        res.send(response);
                    }, function(err) {
                        res.send(err);
                        console.log(err, ' error');
                    });
                });
            });
                // model.question_scheduling.findOne({
                //     where: { id : req.params.id },
                //     include: []
                // })
                // .then(function(rspp) {
                //     // var data = {
                //     //     data: rspp.dataValues,
                //     //     action: 'update'
                //     // }
                //     // req.app.get('io').emit('game_plan_template_messages:' + gameMsg.gamePlanTemplateId,data);
                //     // send_message_for_user(rspp.dataValues,req.app.get('io'));
                //     res.send(rspp);
                // });  
            }else{
                res.send(result);
            }
        });
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    model.question_scheduling.create(record)
        .then(function(msg) {
            model.question_scheduling.findOne({
                where: { id : msg.id },
                include: [{
                    model: model.question, attributes: ['id', 'name']
                }]
            })
            .then(function(rspp) {
                res.send(rspp);
            });  
        });
});

router.post('/update/:id', function(req, res, next) {
    model.article.update(req.body.data,
        {where: { id : req.params.id }})
        .then(function(result) {
        	model.article.findOne({
		        where: {id: req.params.id }
		    }).then(function(result) {
		        res.send(result);
		    });
        });
});

router.delete('/remove/:id', function(req, res, next) {
    var id = req.params.id;
    model.article.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.article.update({isDeleted:true},{where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    })
});

module.exports = router;
