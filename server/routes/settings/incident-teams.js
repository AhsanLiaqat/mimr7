var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');

router.get('/get', function(req, res, next) {
    model.incidents_team.findOne({
        where: {id: req.query.id}
        ,include: [{
            model: model.user
        }]}).then(function(response) {
        res.send(response);
    });
});
router.get('/all', function(req, res, next) {
    model.incidents_team.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted:false},
        include: [{
            model: model.user,
            include:[{
                model: model.role
            }],
        }]

    }).then(function(response) {
        res.send(response);
    });
});

router.get('/list',function(req,res,next){
    model.incidents_team.findAll({
        where :{userAccountId:req.user.userAccountId,isDeleted:false}
    }).then(function(response){
        res.send(response);
    });
});

router.get('/type-all', function(req, res, next) {
    model.incidents_team.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted:false, teamType: req.query.teamType}}).then(function(response) {
        res.send(response);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userId = req.user.id;
    record.userAccountId = req.user.userAccountId;
    model.incidents_team.create(record).then(function (team) {
        var users = [];
        _.each(record.users, function (u) {
            users.push(model.user.findOrCreate({
                where: { id: u.id }
            }));
        });
        Q.allSettled(users).then(function (res) {
            var user = _.map(res, function (user) { return user.value[0] });
            team.addUsers(user);
        });
        res.send(team);
    });
});

router.post('/update', function(req, res, next) {
    var record = req.body.data;
    model.incidents_team.update(req.body.data, {where: { id : req.body.data.id }}).then(function (team) {
        var users = [];
        _.each(record.users, function (u) {
            users.push(model.user.findOrCreate({
                where: { id: u.id }
            }));
        });
        Q.allSettled(users).then(function (res) {
            var user = _.map(res, function (u) { return u.value[0] });
            model.incidents_team.findOne({
                where: { id: req.body.data.id }
            }).then(function (n) {
                n.setUsers(user);
            });
        });
        res.send(team);
    });
});

router.delete('/remove/:id', function(req, res, next) {
    model.incidents_team.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.incidents_team.update({isDeleted:true,status:false},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    })
});


module.exports = router;
