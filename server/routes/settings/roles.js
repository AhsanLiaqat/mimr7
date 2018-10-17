var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');


router.get('/get', function(req, res, next) {
    model.role.findOne({
        where: {
            id: req.query.id,isDeleted:false
        },
        include: [{
            required: false,
            model: model.user,
            where: {
                isDeleted:false
            }
        }]
    }).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.role.findAll({
        where:{
            userAccountId: req.user.userAccountId,isDeleted:false
        },
        order: [
            ['name', 'ASC']
        ],
        include: [{
            model: model.user
        }]}).then(function(response) {
        res.send(response);
    });
});
router.post('/update-user-role', function(req, res, next) {
    var record = req.body.data;
    model.role.update(req.body.data, {where: { id : req.body.data.id }}).then(function (team) {
        var users = [];
        _.each(record.users, function (u) {
            users.push(model.user.findOrCreate({
                where: { id: u.id }
            }));
        });
        Q.allSettled(users).then(function (res) {
            var user = _.map(res, function (u) { return u.value[0] });
            model.role.findOne({
                where: { id: req.body.data.id }
            }).then(function (n) {
                n.setUsers(user);
            });
        });
        res.send(team);
    });
});
router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.role.create(record).then(function(response) {
        res.send(response);
    }).catch(function(err) {
        // print the error details
        console.log(err, req.body);
    });
});
router.post('/save-user-role', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.role.create(record).then(function (role) {
        var users = [];
        _.each(record.users, function (u) {
            users.push(model.user.findOrCreate({
                where: { id: u.id }
            }));
        });
        Q.allSettled(users).then(function (res) {
            var user = _.map(res, function (u) { return u.value[0] });
            role.addUsers(user);
        });
        res.send(role);
       
    });
});

router.delete('/remove/:id', function(req, res, next) {
    model.role.findOne({where: {id: req.params.id}}).then(function(item) {
        item.destroy().then(function(response) {
            res.send({success:true, msg:response.toString()});
        },function(response){
            item.update({isDeleted:true}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            })
        })
    });
});
router.post('/update', function(req, res, next) {
    model.role.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});

module.exports = router;
