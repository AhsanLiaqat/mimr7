var express = require('express');
var router = express.Router();
var model = require('../models');
var url = require("url");
var mimetypes = require('mime-types');
var path = require('path');
var _ = require('underscore');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var Q = require('q');
var fs = require('fs');
var s3Library = require('../lib/aws/s3').library;

router.get('/get/:id', function(req, res, next) {
    model.content_plan_template.findOne({
        where: {id: req.params.id},
        include: [{
            model: model.player_list,
                include : [{model : model.organization}] 
        },{
            model : model.article
        },{
            model: model.question_scheduling
        },{
            model : model.scheduled_survey
        }]
    }).then(function(contentPlanTmplate) {
        // var unique_questions = _.uniq(contentPlanTmplate.question_schedulings,'offset');
        res.send(contentPlanTmplate);
    });
});


router.post('/update/:id', function(req, res, next) {
    model.content_plan_template.update(req.body,
        {where: { id : req.params.id }})
        .then(function(result) {
            model.content_plan_template.findOne({
                where: {id: req.params.id},
                attributes: ['id', 'scheduled_date', 'createdAt','start_time','status','play_date','pause_date','resume_date'],
                order: [['createdAt', 'DESC']],
                include: []
            }).then(function(game) {
                res.send(game);
            });
        });
});


router.get('/play-content-summary/:id', function(req, res, next) {
    model.content_plan_template.findOne({
        where: {id: req.params.id},
        order: [['createdAt', 'DESC']],
        include: [{model: model.question_scheduling,
            include : [{model : model.question,
                            include : [{model : model.message}]},
                        {model : model.user}]
        },{model : model.article}]
    }).then(function(contentPlanTmplate) {
        res.send(contentPlanTmplate);
    });
});

router.get('/survey-summary/:id', function(req, res, next) {
    model.content_plan_template.findOne({
        where: {id: req.params.id},
        order: [['createdAt', 'DESC']],
        include: [{model : model.scheduled_survey,
            include : [{model : model.dynamic_form},{
                model : model.user                
            }]
        }]
    }).then(function(contentPlanTmplate) {
        res.send(contentPlanTmplate);
    });
});

router.get('/get-player-detail/:id', function(req, res, next) {
    model.content_plan_template.findOne({
        where: {id: req.params.id},
        order: [['createdAt', 'DESC']],
        include: [
        {model: model.player_list,
            include : [{model : model.user,
                include : [{model : model.question_scheduling,
                    where : {contentPlanTemplateId : req.params.id},
                    include : [{
                        model : model.answer
                    },{
                        model : model.question
                    }]
                }]
            }]
        }]
    }).then(function(playerDetail) {
        res.send(playerDetail);
    });
});

router.get('/get-survey-detail/:id', function(req, res, next) {
    model.content_plan_template.findOne({
        where: {id: req.params.id},
        order: [['createdAt', 'DESC']],
        include: [
        {model: model.player_list,
            include : [{model : model.user,
                include : [{model : model.scheduled_survey,
                    where : {contentPlanTemplateId : req.params.id},
                    include : [{
                        model : model.submission
                    },{
                        model : model.dynamic_form
                    }]
                }]
            }]
        }]
    }).then(function(playerDetail) {
        res.send(playerDetail);
    });
});


router.get('/all', function(req, res, next) {
    model.content_plan_template.findAll({ where : { userAccountId : req.query.userAccountId,isDeleted : false},
        attributes: ['id', 'scheduled_date', 'content_activated', 'createdAt','status','start_time','play_date'],
        order: [['createdAt', 'DESC']],
        include: [
            {model: model.player_list, attributes: ['id', 'name','description'],
                        include: [{ model: model.user}]},
            {model: model.article, attributes: ['id', 'title','description','kind']}]
    })
        .then(function(result) {
            // result.forEach(function(game) {
                // game.dataValues.client = game.dataValues.organization ? { id: game.dataValues.organization.id, name: game.dataValues.organization.name, type: 'External' } : { id: game.dataValues.user_account.id, name: game.dataValues.user_account.organizationName, type: 'Internal' }
                // delete game.dataValues.organization;
                // delete game.dataValues.user_account;
            // });
            res.send(result);
        });
});

router.post('/cancel-content/:id', function(req, res, next) {
    model.content_plan_template.update(req.body,
        {where: { id : req.params.id }
    }).then(function(scheduledQuestion) {
        model.content_plan_template.findOne({where : {id : req.params.id},
            include : [{
                model : model.question_scheduling
            }]
        }).then(function(resp){
            resp.question_schedulings.forEach(function(ques) {
                model.question_scheduling.update({activated: true},{
                    where: {id: ques.id}
                }).then(function(response) {
                    res.send(response);
                });
            });
        });
    });
});


router.post('/cancel-survey/:id', function(req, res, next) {
    model.content_plan_template.update(req.body,
        {where: { id : req.params.id }
    }).then(function(scheduledQuestion) {
        model.content_plan_template.findOne({where : {id : req.params.id},
            include : [{
                model : model.scheduled_survey
            }]
        }).then(function(resp){
            resp.scheduled_surveys.forEach(function(survy) {
                model.scheduled_survey.update({activated: true},{
                    where: {id: survy.id}
                }).then(function(response) {
                    res.send(response);
                });
            });
        });
    });
});


router.post('/create', function(req, res, next) {
    var record = req.body;
    record.userAccountId = req.user.userAccountId;
    model.content_plan_template.create(record).then(function(contentPlanTmplate) {
        res.send(contentPlanTmplate);
    });
});

router.get('/closed-contents', function(req, res, next) {
    model.content_plan_template.findAll({where : {status : 'stop'},
        include : [{
            model : model.article
        }]
    }).then(function(result) {
            res.send(result);
        });
});

router.get('/closed-surveys', function(req, res, next) {
    model.content_plan_template.findAll({where : {status : 'stop'},
        include : [{
            model : model.dynamic_form
        }]
    }).then(function(result) {
            res.send(result);
        });
});

router.delete('/remove/:id', function(req, res, next) {
    model.content_plan_template.destroy({where: {id: req.params.id}})
    .then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.content_plan_template.update({isDeleted:true},{where: {id: req.params.id}})
        .then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

module.exports = router;
