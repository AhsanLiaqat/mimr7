var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');

router.get('/all/:type/:userId/:incidentId', function(req, res, next) {
    if(req.params.type == 'others'){
        model.message.findAll({
        where: {
            userId: req.params.userId,
            incidentId: req.params.incidentId,
            isDeleted: false
        }}).then(function(messages) {
            res.send(messages);
        });
    }else{
        model.message.findAll({
        where: {
            gamePlayerId: req.params.userId,
            incidentId: req.params.incidentId,
            isDeleted: false
        }}).then(function(messages) {
            res.send(messages);
        });
    }
});

router.get('/timeline/:incidentId', function(req, res, next) {
    var incidentId = req.params.incidentId;
    model.message.findAll({
        where: {
            incidentId: incidentId,
            isDeleted: false
        }}).then(function(messages) {
        res.send(messages);
    });
});

router.get('/incoming/:incidentId', function(req, res, next) {
    var incidentId = req.params.incidentId;
    model.message.findAll({
        where: {
            incidentId: incidentId,
            status: 'Incoming',
            isDeleted: false
        },
        include: [{
            model: model.user,
            as: 'user',
            attributes: ['firstName', 'lastName', 'id']
        },
        {
            model: model.game_player,
            attributes: ['firstName', 'lastName', 'id']
        }]
    })
    .then(function(messages) {
        res.send(messages);
    });
});

router.post('/save', function(req, res, next) {
    var data = req.body.data;
    model.message.create(data).then(function(message) {
        model.message.findOne({
            where: {id: message.id},
            include: [{
                model: model.user,
                as: 'user',
                attributes: ['firstName', 'lastName', 'id']
            },
            {
                model: model.game_player,
                attributes: ['firstName', 'lastName', 'id']
            }]
        }).then(function(msg) {
			var io = req.app.get('io');
			var response = {
				data: msg,
				action: 'new'
			}
			io.emit('incoming_message:' + msg.incidentId,response)
            res.send(msg);
        });
    });
});

router.post('/update', function(req, res, next) {
    var data = req.body.data;
    model.message.update(data, {where:{ id : data.id }}).then(function(message) {
		model.message.findOne({
            where: {id: data.id},
            include: [{
                model: model.user,
                as: 'user',
                attributes: ['firstName', 'lastName', 'id']
            },
            {
                model: model.game_player,
                attributes: ['firstName', 'lastName', 'id']
            }]
        }).then(function(msg) {
			var io = req.app.get('io');
			if(msg.status.toLowerCase() === "incoming"){
				var response = {
					data: msg,
					action: 'new'
				}
				io.emit('incoming_message:' + data.incidentId,response)
			}else {
				var response = {
					data: msg,
					action: 'delete'
				}
				io.emit('incoming_message:' + msg.incidentId,response)
			}
            res.send(msg);
        });
    });
});


router.delete('/delete/:id', function (req, res, next) {
    model.message.destroy({
        where: {id: req.params.id}
    }).then(function(response){
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.message.update({isDeleted:true},{
            where: {id: req.params.id}
        }).then(function(response){
            res.send({success:true, msg:response.toString()});
        })
    })
});


module.exports = router;
