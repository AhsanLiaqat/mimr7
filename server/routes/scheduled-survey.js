var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var schedule = require('node-schedule');
var Q = require('q');
var mailServer = require('../lib/email');

var j = schedule.scheduleJob('01 * * * * *', function(){
    model.scheduled_survey.findAll({
        where: {activated: false,skip: false,isDeleted:false},
        attributes: ['id', 'setOffTime', 'activatedAt']
    }).then(function(surveys) {
        surveys.forEach(function(survy) {
            if(new Date(survy.setOffTime).getFullYear() == new Date().getFullYear() &&
               new Date(survy.setOffTime).getMonth() == new Date().getMonth() &&
               new Date(survy.setOffTime).getDay() == new Date().getDay() &&
               new Date(survy.setOffTime).getHours() == new Date().getHours() &&
               new Date(survy.setOffTime).getMinutes() == new Date().getMinutes()
            ){
                model.scheduled_survey.findOne({
                    where: {id: survy.id},
                    include: [
                    {
                        model : model.user
                    }]
                }).then(function(users_data) {
                    var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://mimr7-dev1.us-east-1.elasticbeanstalk.com/#/pages/surveys-forms' + '/' + users_data.userId + '/' + users_data.id;
                    var mailOptions = {
                        from: 'noreply@crisishub.co',
                        to: users_data.user.email,
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
                if(survy.type == true){
                    var record = {};
                    record.lastSent = survy.setOffTime;
                    var comingDate = new Date(survy.setOffTime);
                    var secs = survy.repeatTime
                    var toSave = new Date(comingDate.getTime() + secs*1000*60*60);
                    record.setOffTime = toSave.toISOString();
                    record.activatedAt = new Date();
                    model.scheduled_survey.update(record, {where: {id: survy.id}}).then(function(response){
                        model.scheduled_survey.findOne({
                            where: {id: survy.id},
                            include: [{
                                model : model.user
                            },{
                                model : model.dynamic_form
                            }]
                        }).then(function(response) {
                            var surveyResponse = {
                                data: response,
                                action: 'update'
                            }
                            process.io.emit('detail_survey:' + response.contentPlanTemplateId,surveyResponse)
                        });
                    });   
                }else{
                    model.scheduled_survey.update({activated: true, activatedAt: new Date()}, {where: {id: survy.id}}).then(function(res){
                        model.scheduled_survey.findOne({
                            where: {id: survy.id},
                            include: [{
                                model : model.user
                            },{
                                model : model.dynamic_form
                            }]
                        }).then(function(response) {
                            var surveyResponse = {
                                data: response,
                                action: 'update'
                            }
                            process.io.emit('detail_survey:' + response.contentPlanTemplateId,surveyResponse)
                        });
                    });
                }

            }
        });
    });
});

var j = schedule.scheduleJob('*/1 * * * * *', function(){
    model.scheduled_survey.findAll({
        where: {activated : true,status : false,isDeleted:false},
        attributes: ['id', 'setOffTime', 'activatedAt','expiryTime']
    }).then(function(questions) {
        questions.forEach(function(msg) {
            if(new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getFullYear() == new Date().getFullYear() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getMonth() == new Date().getMonth() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getDay() == new Date().getDay() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getHours() == new Date().getHours() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getMinutes() == new Date().getMinutes() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getSeconds() == new Date().getSeconds()
            ){
                model.scheduled_survey.update({status: true}, {where: {id: msg.id}})
                .then(function(gamePlanTmplate) {
                    model.scheduled_survey.findOne({
                        where: {id: msg.id},
                        include: [{
                            model: model.content_plan_template},{
                            model : model.submission
                        }]
                    }).then(function(response) {
                        var data = {
                            data: response,
                            action: 'sent'
                        }
                        process.io.emit('survey_forms_expiry:' + response.id,data)
                    });

                });
            }
        });
    });
});

var j = schedule.scheduleJob('*/1 * * * * *', function(){
    model.scheduled_survey.findAll({
        where: {activated : true,status : false,isDeleted:false},
        attributes: ['id', 'setOffTime', 'activatedAt','expiryTime']
    }).then(function(questions) {
        questions.forEach(function(msg) {
            if(new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getFullYear() == new Date().getFullYear() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getMonth() == new Date().getMonth() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getDay() == new Date().getDay() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getHours() == new Date().getHours() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getMinutes() == new Date().getMinutes() &&
               new Date(msg.activatedAt.getTime() + msg.expiryTime*1000).getSeconds() == new Date().getSeconds()
            ){
                model.scheduled_survey.update({status: true}, {where: {id: msg.id}})
                .then(function(gamePlanTmplate) {
                    model.scheduled_survey.findOne({
                        where: {id: msg.id},
                        include: [{
                            model: model.content_plan_template},{
                            model : model.submission
                        }]
                    }).then(function(response) {
                        var data = {
                            data: response,
                            action: 'sent'
                        }
                        process.io.emit('survey_summary_page:' + response.contentPlanTemplateId,data)
                    });

                });
            }
        });
    });
});


router.get('/all', function(req, res, next) {
    model.survey.findAll({
        where : { articleId : req.query.id },
            include : [{
                model : model.dynamic_form
            }]
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userId = req.body.userId;
    record.userAccountId = req.user.userAccountId;
    model.scheduled_survey.create(record)
        .then(function(survey) {
            model.scheduled_survey.findOne({
                where: { id : survey.id }
            })
            .then(function(rspp) {
                res.send(rspp);
            });  
        });
});

router.post('/update/:id',function(req,res,next){
    model.scheduled_survey.update(req.body.data,{where: { id : req.params.id }})
    .then(function(result) {
        model.scheduled_survey.findOne({
            where: {id: req.params.id},
            include: [{
                model : model.user
            },{
                model : model.dynamic_form
            }]
        }).then(function(response) {
             var data = {
                data: response,
                action: 'skip'
            }
            process.io.emit('detail_survey:' + response.contentPlanTemplateId,data)
            res.send(response);
        });
    });

});

router.post('/update-message-off-set/:id',function(req,res,next){
    var record = req.body.data;
    model.scheduled_survey.findOne({
        where: {id: req.params.id }
    }).then(function(gameMsg) {
        var comingDate = new Date(record.setOffTime)
        var secs = gameMsg.offset
        var toSave = new Date(comingDate.getTime() + secs*1000*60*60);
        record.setOffTime = toSave.toISOString();
        model.scheduled_survey.update(record,{where: { id : req.params.id }})
        .then(function(result) {
            res.send(result);
        });
    });
});

router.post('/send-survey/:id',function(req,res,next){
    model.scheduled_survey.findOne({where : {id : req.params.id}}).then(function(result){
        console.log('---------->>>>',result);
        if(result.type == true){
        console.log('----------hahaha');

            var record = {};
            record.lastSent = result.setOffTime;
            var comingDate = new Date(result.setOffTime);
            var secs = result.repeatTime
            var toSave = new Date(comingDate.getTime() + secs*1000*60*60);
            record.setOffTime = toSave.toISOString();
            record.activatedAt = new Date();
        console.log('----------record',record);

            model.scheduled_survey.update(record, {where: {id: result.id}}).then(function(sent_survey){
                model.scheduled_survey.findOne({
                    where: {id: req.params.id},
                    include: [{
                        model : model.user
                    },{
                        model : model.dynamic_form
                    }]
                }).then(function(scheduled_survey) {
                    var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://localhost:8082/#/pages/surveys-forms' + '/' + scheduled_survey.userId + '/' + scheduled_survey.id;
                    var mailOptions = {
                        from: 'noreply@crisishub.co',
                        to: scheduled_survey.user.email,
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
                    var quesCoach = {
                        data: scheduled_survey,
                        action: 'update'
                    }
                    process.io.emit('detail_survey:' + scheduled_survey.contentPlanTemplateId,quesCoach)
                });
            }); 
        }else{
            model.scheduled_survey.update({activated: true, activatedAt: new Date()}, {where: {id: req.params.id}})
                .then(function(gamePlanTmplate) {
                model.scheduled_survey.findOne({
                    where: {id: req.params.id},
                    include: [{
                        model : model.user
                    },{
                        model : model.dynamic_form
                    }]
                }).then(function(scheduled_survey) {
                    var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://localhost:8082/#/pages/surveys-forms' + '/' + scheduled_survey.userId + '/' + scheduled_survey.id;
                    var mailOptions = {
                        from: 'noreply@crisishub.co',
                        to: scheduled_survey.user.email,
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
                    var quesCoach = {
                        data: scheduled_survey,
                        action: 'update'
                    }
                    process.io.emit('detail_survey:' + scheduled_survey.contentPlanTemplateId,quesCoach)
                });
            });
        }
    });
});

router.get('/get/:id', function(req, res, next) {
    model.scheduled_survey.findOne({
        where: {id: req.params.id },
        include : [{model : model.dynamic_form},
                    {model : model.content_plan_template},{
                        model : model.submission
                    }]
    }).then(function(scheduled_survy) {
        res.send(scheduled_survy);
    });
});


module.exports = router;
