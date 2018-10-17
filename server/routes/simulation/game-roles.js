var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get/:id', function(req, res, next) {
    model.game_role.findOne({
        where: {id: req.params.id}
    }).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.game_role.findAll({
        where:{
            userAccountId: req.user.userAccountId,
            isDeleted:false
        },
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'description', 'createdAt','gamePlanId','order','gamePlanTeamId'],
        include: [  { model: model.game_plan_team, attributes: ['id', 'name'] }]
    }).then(function(response) {
        res.send(response);
    });
});
router.get('/role-for-game', function(req, res, next) {
    model.game_role.findAll({
        where:{
            userAccountId: req.user.userAccountId,
            gamePlanId: req.query.gamePlanId,
            isDeleted:false
        },
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'description', 'createdAt','gamePlanId','order','gamePlanTeamId'],
        include: [  { model: model.game_plan_team, attributes: ['id', 'name'] }]
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body;
    record.userAccountId = req.user.userAccountId;
    model.game_role.create(record)
        .then(function(response) {
            res.send(response);
        }).catch(function(err) {
        // print the error details
            console.log(err, req.body);
            res.send(err);
        });
});

router.delete('/remove/:id', function(req, res, next) {
    model.game_role.findOne({where: {id: req.params.id}})
        .then(function(item) {
            item.destroy().then(function(response) {
                res.send({success:true, msg:response.toString()});
            },function(response){
                item.update({isDeleted:true}).then(function(response) {
                    res.send({success:true, msg:response.toString()});
                })
            });
        });
});

router.put('/update/:id', function(req, res, next) {
    model.game_role.update(req.body, {where: { id : req.body.id }})
        .then(function(response) {
            res.send(response);
        });
});

module.exports = router;
