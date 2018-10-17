var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');

router.get('/list', function(req, res, next) {
    model.color_palette.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},
        include: [{model: model.user}]
    })
        .then(function(users) {
            res.json(users);
        });
});


router.post("/default-colors", function(req, res, next) {
    var data = {};
    var typeColor = ['Red', 'Blue', 'Yellow'];
    _.each(typeColor, function (color) {
        data.userAccountId = req.query.userAccountId;
        data.color = color;
        model.color_palette.create(data).then(function(){

        });
    })
    res.send('Success');
});


router.post("/save", function(req, res, next) {
    var data = req.body.data;
    console.log(data);
    data.userAccountId = req.user.userAccountId;
    if (!data.id) {
        model.color_palette.create(data).then(function(color) {
            var users = [];
            _.each(data.users, function (u) {
                users.push(model.user.findOrCreate({
                    where: { id: u.id }
                }));
            });
            Q.allSettled(users).then(function (res) {
                var user = _.map(res, function (user) { return user.value[0] });
                color.addUsers(user);
            });
            res.send(color);
        });
    } else {
        model.color_palette.update(data,
            {
                where: {id: data.id}
            }).then(function() {
            var users = [];
            _.each(data.users, function (u) {
                users.push(model.user.findOrCreate({
                    where: { id: u.id }
                }));
            });
            Q.allSettled(users).then(function (res) {
                console.log('in Q');
                var user = _.map(res, function (u) { return u.value[0] });
                model.color_palette.findOne({
                    where: { id: data.id }
                }).then(function (n) {
                    n.setUsers(user);
                });
            });
            res.send();
        });
    }
});

router.delete("/remove/:id", function(req, res, next) {
    var id = req.params.id;
    model.color_palette.findOne({where: {id: id}}).then(function(color){
        color.setUsers([]);
        model.color_palette.destroy({where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        },function(response){
            model.color_palette.update({isDeleted:true},{where: {id: id}}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            })
        })
    });
});

module.exports = router;
