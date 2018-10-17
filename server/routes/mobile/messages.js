var express = require('express');
var router = express.Router();
var model = require('../../models');
var socket = require('../../lib/socket');

router.get('/all', function(req, res, next) {
    if( req.query.userId != null){
        model.message.findAll({
            where: {
                userId: req.query.userId,
                incidentId: req.query.incidentId
            }}).then(function(messages) {
            res.send(messages);
        });
    }
    else{
        res.send('Please provide userId');
    }
});

router.get('/all/:incidentId', function(req, res, next) {
    var incidentId = req.params.incidentId;
    model.message.findAll({
        where: {
            userId: req.query.userId,
            incidentId: incidentId
        }}).then(function(messages) {
        res.send(messages);
    });
});

router.post('/save', function(req, res, next) {
    var data = req.body;
    model.message.create(data).then(function(message) {
        res.send(message);
        model.message.findOne({
            where: {
                id: message.id,
            },
            include: {
                model: model.user,
                as: 'user',
                attributes: ['firstName', 'lastName', 'id']
            }
        }).then(function(message) {
			var io = req.app.get('io');
			var response = {
				data: message,
				action: 'new'
			}
			io.emit('incoming_message:' + message.incidentId,response)
        });


    });
});

module.exports = router;
