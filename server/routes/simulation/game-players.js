var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get', function(req, res, next) {
    model.game_player.findOne({
        where: {id: req.query.id}}).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.game_player.findAll({
        where: {
            userAccountId: req.user.userAccountId,isDeleted:false}
        // include: [{model: model.game_plan}]
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/create', function(req, res, next) {
    var record = req.body;
    record.userAccountId = req.user.userAccountId;
    model.game_player.create(record).then(function(response) {
        res.send(response);
    });
});

router.put('/update/:id?', function(req, res, next) {
    model.game_player.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});
router.delete('/remove/:id?', function(req, res, next) {
    model.game_player.findOne({where: {id: req.params.id}}).then(function(item) {
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
