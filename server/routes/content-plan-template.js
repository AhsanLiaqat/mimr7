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
        attributes: ['id', 'scheduled_date', 'createdAt','playerListId'],
        order: [['createdAt', 'DESC']],
        include: [
        {model: model.player_list, attributes: ['id', 'name','description']},
        {model: model.question_scheduling, attributes: ['id', 'setOffTime','offset','index']}]
    }).then(function(contentPlanTmplate) {
        // console.log('-=-=-=-=->>>><><><><>',contentPlanTmplate.question_schedulings.length);
        var unique_questions = _.uniq(contentPlanTmplate.question_schedulings,'offset');
        console.log('-=-=-=-=-=-=-=-=-=-=-=-=',unique_questions)
        res.send(unique_questions);
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
                // var io = req.app.get('io');
                // var data = {
                //     data: game,
                //     action: 'update'
                // }
                // io.emit('simulation_active_game:' + game.id,data)
                res.send(game);
            });
        });
});


router.get('/all', function(req, res, next) {
    model.content_plan_template.findAll({
        attributes: ['id', 'scheduled_date', 'content_activated', 'createdAt','status','start_time','play_date'],
        order: [['createdAt', 'DESC']],
        include: [
            {model: model.player_list, attributes: ['id', 'name','description'],
                        include: [{ model: model.user}]},
            {model: model.article, attributes: ['id', 'title']}]
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

router.post('/create', function(req, res, next) {
    var record = req.body;
    record.userAccountId = req.user.userAccountId;
    model.content_plan_template.create(record).then(function(contentPlanTmplate) {
        res.send(contentPlanTmplate)
    });
});

router.delete('/remove/:id', function(req, res, next) {
    var id = req.params.id;
    model.message.findOne({where : {id : id}}).then(function(result){
        model.message.destroy({where: {id: id}}).then(function(response) {
            var io = req.app.get('io');
            var xresp = {
                data: result,
                action: 'delete'
            }
            io.emit('incoming_message:' + req.user.userAccountId,xresp)
            io.emit('incoming_message:' + result.articleId,xresp)
            res.send({success:true, msg:response.toString()});
        },function(response){
            model.message.update({isDeleted:true},{where: {id: id}}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            })
        });
    });
});

module.exports = router;
