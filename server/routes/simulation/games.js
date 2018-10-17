var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/get/:id', function(req, res, next) {
    model.game_plan.findOne({
        where: {id: req.params.id },
        attributes: ['id', 'name', 'description', 'planDate', 'gameCategoryId']
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

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.game_plan.create(record)
        .then(function(gamePlan) {
            model.game_plan.findOne({
                where: {id: gamePlan.id},
                include: [{model: model.game_category, attributes: ['name']}]
            }).then(function(result) {
                res.send(result);
            });
        });
});

router.post('/update/:id', function(req, res, next) {
    model.game_plan.update(req.body.data,
        {where: { id : req.params.id }})
        .then(function(result) {
            res.send(result);
        });
});

router.delete('/remove/:id', function(req, res, next) {
    model.game_plan.destroy({where: {id: req.params.id}})
    .then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.game_plan.update({isDeleted:true},{where: {id: req.params.id}})
        .then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

router.get('/:id/get-roles', function(req, res, next) {
    model.game_plan.findOne({
        where: {id: req.params.id },
        include: [{model: model.game_role, as: 'roles',
            attributes: ['id','name']
            ,include: [{model: model.game_plan_team}]
        }]
    }).then(function(gamePlan) {
        res.send(gamePlan);
    });
});

module.exports = router;
