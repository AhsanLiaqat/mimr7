var express = require('express');
var router = express.Router();
var model = require('../../models');
var socket = require('../../lib/socket');

router.get('/all/:incidentId', function(req, res, next) {
    var incidentId = req.params.incidentId;
    model.message_history.findAll({
        where: {
            incidentId: incidentId,
            status: true,
            isDeleted: false
        }}).then(function(messages) {
        res.send(messages);
    });
});

router.get('/timeline/:incidentId', function(req, res, next) {
    var incidentId = req.params.incidentId;
    var categoryId = req.query.category;
    model.message_history.findAll({
        where: {
            incidentId: incidentId,
            classId: categoryId,
            isDeleted: false
        }}).then(function(messages) {
        res.send(messages);
    });
});

router.post('/save', function(req, res, next) {
    var data = req.body.data;
    data.userId = req.user.id;
    data.index = req.body.data.index;
    if(data.owner === undefined) {
        data.owner = req.user.id;
    }
    data.editorId = req.user.id;
    model.message_history.create(data).then(function(message) {
        message.getUser().then(function(user){
            var msg = message.toJSON();
			if(user)
            msg.user = user.toJSON();
			var io = req.app.get('io');
			var data = {
				data: msg,
				action: "new"
			}
			io.emit('incident_class_messages:' + msg.incidentId,data)
            // broadcastClass(msg.classId);
            res.send(msg);
        });
    });
});
router.post('/income-to-history', function(req, res, next) {
    var data = req.body.data;
    data.index = req.body.data.index;
    model.message_history.create(data).then(function(message) {
        message.getUser().then(function(user){
            var msg = message.toJSON();
			if(user){
                msg.user = user.toJSON();
            }
			var io = req.app.get('io');
			var data = {
				data: msg,
				action: "new"
			}
			io.emit('incident_class_messages:' + msg.incidentId,data)
			// broadcastClass(msg.classId);
            res.send(msg);
        });
    });
});

function broadcastClass(classId){
    model.class.findOne({
        where: {id: classId}
    }).then(function(cls){
		var io = req.app.get('io');
		io.emit('incident_class_message:' + cls.incidentId,{})
    });
}

router.post('/update', function(req, res, next) {
	var data = req.body.data;
	data.editorId = req.user.id;
	model.message_history.findOne({where: { id : data.id }}).then(function(response) {
		response.getUser().then(function(user){
			var Message  = {
				oldMessage : response.toJSON(),
				user : user?user.toJSON():{}
			}
			console.log("old",Message.oldMessage.classId);
			model.message_history.update(data, {where: { id : data.id } , returning: true, raw: true}).then(function(message) {
				var io = req.app.get('io');
				message[1][0].user = Message.user;
				console.log("new",message[1][0].classId);
				if(Message.oldMessage.classId === message[1][0].classId){
					console.log("Update");
					message[1][0].user = Message.user;
					var data = {
						data: message[1][0],
						action: "update"
					}
					io.emit('incident_class_messages:' + message[1][0].incidentId,data)
				}else {
					console.log("Move");
					message[1][0].user = Message.user;
					var data = {
						data: { classId: Message.oldMessage.classId, messageId: Message.oldMessage.id },
						action: "delete"
					}
					var newData = {
						data: message[1][0],
						action: "new"
					}
					io.emit('incident_class_messages:' + message[1][0].incidentId,data)
					io.emit('incident_class_messages:' + message[1][0].incidentId,newData)
				}
				res.send(message);
			})
		});
	});
});

router.post('/update-index', function(req, res, next) {
	var io = req.app.get('io');
	var data = req.body.data;
	var count = 0;
	for (elem of data.array) {
		elem.editorId = req.user.id;
		model.message_history.update(elem, {where: { id : elem.id }}).then(function(message) {
			count += 1
			if(data.array.length === count){
				console.log('===========================',elem);
				var dataToSend = {
					data: data,
					action: "update-index"
				}
				io.emit('incident_class_messages:' + data.incidentId,dataToSend)
				res.send({success:true});
			}
		})
	}
});

router.delete('/remove/:id/:classId', function(req, res, next) {
    model.message_history.findOne({where: {id: req.params.id}}).then(function(msg) {
        msg.editorId = req.user.id;
        msg.deletedAt = new Date();
        msg.status = false;
        msg.save();
		msg = msg.toJSON();
		var data = {
			data: { classId: req.params.classId, messageId:req.params.id },
			action: "delete"
		}
		var io = req.app.get('io');
		io.emit('incident_class_messages:' + msg.incidentId,data)
        // broadcastClass(req.params.clsId);
        res.json({message: "Success"});
    });
});

router.post('/bulk-remove', function (req, res, next) {
    model.message_history.destroy({ where: { id: req.body.data } }).then(function (response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.message_history.update({isDeleted:true},{ where: { id: req.body.data } }).then(function (response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});
//not in use
router.post('/update/subId', function(req, res, next) {
    var data = req.body.data;
    data.userId = req.user.id;
    model.message_history.update({
        subClassId: null,
        userId: data.userId
    },
    {
        where: { subClassId: data.id }
    }).then(function(message) {
        res.send(message);
    });
});


module.exports = router;
