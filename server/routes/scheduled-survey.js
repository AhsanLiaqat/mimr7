var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var schedule = require('node-schedule');
var Q = require('q');
var mailServer = require('../lib/email');


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
            var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://localhost:8082/#/pages/content-questions' + '/' + scheduled_survey.userId + '/' + scheduled_survey.id;
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
});


module.exports = router;
