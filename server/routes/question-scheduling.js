var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var schedule = require('node-schedule');
var shortUrl = require('node-url-shortener');
var Q = require('q');
var mailServer = require('../lib/email');


var j = schedule.scheduleJob('01 * * * * *', function(){
    model.question_scheduling.findAll({
        where: {activated: false,skip: false,isDeleted:false},
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
                        model : model.user
                    }]
                }).then(function(scheduled_question) {
                    var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://mimr7-dev1.us-east-1.elasticbeanstalk.com/#/pages/content-questions' + '/' + scheduled_question.userId + '/' + scheduled_question.id;
                    // shortUrl.short(link, function(err, url){
                    //     console.log(url);
                    // });
                    var mailOptions = {
                        from: 'noreply@crisishub.co',
                        to: scheduled_question.user.email,
                        subject : 'not decided subject',
                        html: link
                    };
                    mailServer.sendMail(mailOptions).then(function(response) {
                        console.log("response," ,response);
                        res.send(response);
                    }, function(err) {
                        res.send(err);
                        console.log(err, ' error');
                    });
                });
                model.question_scheduling.update({activated: true, activatedAt: new Date()}, {where: {id: msg.id}})
                .then(function(gamePlanTmplate) {
                    model.question_scheduling.findOne({
                        where: {id: msg.id},
                        include: [{
                            model : model.user
                        },{
                            model : model.question,
                                include : [{model : model.message}]
                        },{
                            model : model.answer
                        }]
                    }).then(function(response) {
                        var quesCoach = {
                            data: response,
                            action: 'update'
                        }
                        process.io.emit('detail_content:' + response.contentPlanTemplateId,quesCoach)
                    });
                });
            }
        });
    });
});

var j = schedule.scheduleJob('*/1 * * * * *', function(){
    model.question_scheduling.findAll({
        where: {activated : true,status : false,isDeleted:false},
        attributes: ['id', 'setOffTime', 'activatedAt','total_time']
    }).then(function(questions) {
        questions.forEach(function(msg) {
            if(new Date(msg.activatedAt.getTime() + msg.total_time*1000).getFullYear() == new Date().getFullYear() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getMonth() == new Date().getMonth() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getDay() == new Date().getDay() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getHours() == new Date().getHours() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getMinutes() == new Date().getMinutes() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getSeconds() == new Date().getSeconds()
            ){
                model.question_scheduling.update({status: true}, {where: {id: msg.id}})
                .then(function(gamePlanTmplate) {
                    model.question_scheduling.findOne({
                        where: {id: msg.id},
                        include: [{
                            model: model.content_plan_template,
                                include:[{ model: model.player_list}]
                        },{
                            model : model.answer
                        }]
                    }).then(function(response) {
                        var data = {
                            data: response,
                            action: 'sent'
                        }
                        process.io.emit('content_plan_template_messages:' + response.id,data)
                    });

                });
            }
        });
    });
});

var j = schedule.scheduleJob('*/1 * * * * *', function(){
    model.question_scheduling.findAll({
        where: {activated : true,status : false,isDeleted:false},
        attributes: ['id', 'setOffTime', 'activatedAt','total_time']
    }).then(function(questions) {
        questions.forEach(function(msg) {
            if(new Date(msg.activatedAt.getTime() + msg.total_time*1000).getFullYear() == new Date().getFullYear() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getMonth() == new Date().getMonth() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getDay() == new Date().getDay() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getHours() == new Date().getHours() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getMinutes() == new Date().getMinutes() &&
               new Date(msg.activatedAt.getTime() + msg.total_time*1000).getSeconds() == new Date().getSeconds()
            ){
                model.question_scheduling.update({status: true}, {where: {id: msg.id}})
                .then(function(gamePlanTmplate) {
                    model.question_scheduling.findOne({
                        where: {id: msg.id},
                        include: [{
                            model: model.content_plan_template,
                                include:[{ model: model.player_list}]
                        },{
                            model : model.answer
                        }]
                    }).then(function(response) {
                        var data = {
                            data: response,
                            action: 'sent'
                        }
                        process.io.emit('question_expired:' + response.contentPlanTemplateId,data)
                    });

                });
            }
        });
    });
});

router.get('/get/:id', function(req, res, next) {
    model.question_scheduling.findOne({
        where: {id: req.params.id },
        include : [{model : model.question},
                    {model : model.content_plan_template},{
                        model : model.answer
                }]
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
        // if(secs <= 60){
        //     record.activated = true;
        //     record.activatedAt = new Date();
        // }
        var toSave = new Date(comingDate.getTime() + secs*1000*60*60);
        record.setOffTime = toSave.toISOString();
        model.question_scheduling.update(record,{where: { id : req.params.id }})
        .then(function(result) {
            // if(secs <= 60){
            //     model.question_scheduling.findOne({
            //     where: {id: req.params.id},
            //     include: [{model : model.user}]
            // }).then(function(scheduled_question) {
            //     // _.each(scheduled_question.content_plan_template.player_list.users, function (user){
            //         var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://mimr7-dev1.us-east-1.elasticbeanstalk.com/#/pages/content-questions' + '/' + scheduled_question.userId + '/' + scheduled_question.id;
            //         var mailOptions = {
            //             from: 'noreply@crisishub.co',
            //             to: scheduled_question.user.email,
            //             subject : 'not decided subject',
            //             html: link
            //         };
            //         mailServer.sendMail(mailOptions).then(function(response) {
            //             console.log("response," ,response);
            //             res.send(response);
            //         }, function(err) {
            //             res.send(err);
            //             console.log(err, ' error');
            //         });
            //     // });
            // });
            // }else{
                res.send(result);
            // }
        });
    });
});

router.post('/send-question/:id',function(req,res,next){
    model.question_scheduling.update({activated: true, activatedAt: new Date()}, {where: {id: req.params.id}})
        .then(function(gamePlanTmplate) {
        model.question_scheduling.findOne({
            where: {id: req.params.id},
            include: [{
                model : model.user
            },{
                model : model.question,
                    include : [{model : model.message}]
            }]
        }).then(function(scheduled_question) {
            var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://localhost:8082/#/pages/content-questions' + '/' + scheduled_question.userId + '/' + scheduled_question.id;
            // shortUrl.short('http://localhost:8082/#/pages/content-questions', function(err, url){
            //     console.log('what is this url',url);
            // });
            var mailOptions = {
                from: 'noreply@crisishub.co',
                to: scheduled_question.user.email,
                subject : 'not decided subject',
                html: link
            };
            mailServer.sendMail(mailOptions).then(function(response) {
                // console.log("response," ,response);
                res.send(response);
            }, function(err) {
                res.send(err);
                console.log(err, ' error');
            });
            var quesCoach = {
                data: scheduled_question,
                action: 'update'
            }
            process.io.emit('detail_content:' + scheduled_question.contentPlanTemplateId,quesCoach)
        });
    });
});

router.post('/skip/:id',function(req,res,next){
    model.question_scheduling.update(req.body.data,{where: { id : req.params.id }})
    .then(function(result) {
        res.send(result);
    });

});

router.get('/my-messages/:id/:userId', function(req, res, next) {
    model.question_scheduling.findAll({
        where: {contentPlanTemplateId: req.params.id,userId : req.params.userId ,activated : true , isDeleted : false},
        attributes : ['id', 'setOffTime','activatedAt'],
        include: [{
            model : model.question
        },{
            model : model.answer
        }]
    }).then(function(messages) {
        res.send(messages);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userId = req.body.userId;
    record.userAccountId = req.user.userAccountId;
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

router.post('/update/:id',function(req,res,next){
    model.question_scheduling.update(req.body.data,{where: { id : req.params.id }})
    .then(function(result) {
        model.question_scheduling.findOne({
            where: {id: req.params.id},
            include: [{
                model : model.user
            },{
                model : model.question,
                    include : [{model : model.message}]
            }]
        }).then(function(response) {
             var data = {
                data: response,
                action: 'skip'
            }
            process.io.emit('detail_content:' + response.contentPlanTemplateId,data)
            res.send(response);
        });
    });

});

module.exports = router;
