var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');


router.get('/get', function(req, res, next) {
    model.game_player_list.findOne({
        where: {id: req.query.id}}).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.game_player_list.findAll({
        where: {
            userAccountId: req.user.userAccountId,isDeleted:false},
        include: [
            { model: model.game_player}
        ]
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/import-players', function(req, res, next) {
    var record = req.body.data;
    model.game_player_list.findOne({
        where: {
            id: req.body.listId},
        include: [
            { model: model.game_player}
        ]
        }).then(function(response) {
            var playerids = response.game_players.map(function(itm, index) {
                return itm.userId;
            });
            var activities = [];
            _.each(record, function (user) {

                if(record.length > 0){
                    var importPlayer = {
                        firstName : user.firstName,
                        lastName : user.lastName,
                        email : user.email,
                        mobilePhone : user.mobilePhone,
                        country : user.userCountry,
                        active : true,
                        userId : user.id,
                        userAccountId : user.userAccountId,
                        organizationName : req.body.organization,
                    }
                    activities.push(model.game_player.create(importPlayer));
                }
            });
            Q.allSettled(activities).then(function (res) {
                activities = _.map(res, function (player) {
                    return player.value;
                });
            });
            Q.allSettled(activities).done(function (results) {
                var ids = activities.map(function(item, index) {
                    return item.id;
                })
                response.addGame_players(ids);
                res.send(activities);
            });
    });
});

router.post('/create', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.game_player_list.create(record).then(function(response) {
        response.setGame_players(req.body.players);
        res.send(response);
    });
});

router.put('/update/:id?', function(req, res, next) {
    model.game_player_list.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        model.game_player_list.findOne({where: {id: req.params.id}}).then(function(item) {
            item.setGame_players(req.body.players);
        });
        res.send(response);
    });
});
router.delete('/remove/:id?', function(req, res, next) {
    model.game_player_list.findOne({where: {id: req.params.id}}).then(function(item) {
        item.setGame_players([]);
        item.destroy().then(function(response) {
            res.send({success:true, msg:response.toString()});
        },function(response){
            item.update({isDeleted:true}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            })
        });
    });
});

module.exports = router;
