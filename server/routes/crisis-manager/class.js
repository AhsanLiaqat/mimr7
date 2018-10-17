var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var socket = require('../../lib/socket');

router.get('/all', function(req, res, next) {

    var incidentId = req.query.incidentId;

    model.incident.findOne({where: {id:incidentId},
        include: {model: model.class,
            as: 'classes',
            required: false,
            where:{
                isDeleted: false
            },
            order: [
          ['index']
            ],
            include: [{
                model:model.message_history,
                as: 'messages',
                required: false,
                where: {deletedAt: null},

                include: {
                    model: model.user,
                    as: 'user',
                    attributes: ['firstName', 'lastName', 'id']
                }
            },
            {
                model: model.user_accounts
            }]},
            order: [
            [{model: model.class, as: 'classes'}, 'index', 'ASC'],
            [{model: model.class, as: 'classes'}, {model: model.message_history, as: 'messages'}, 'createdAt', 'DESC']
            ]
        }
        ).then(function(response){
            res.send(response);
        }, function(err){
            console.log(err)
        })

    });

router.get('/list', function(req, res, next) {
    var incidentId = req.query.incidentId;
    model.class.findAll({where: {incidentId: incidentId,isDeleted: false}}).then(function(result) {
        res.json(result);
    });
});

function isIdUnique (title, inciId) {
    return model.class.count({ where: { title: title, incidentId: inciId } })
      .then(count => {
        if (count != 0) {
          return false;
        }
        return true;
    });
}

router.post('/saved-categories', function(req, res, next) {
    var data = {};
    var data = req.body.data;
    data.summary = "Summary";
    model.class.create(data).then(function(response) {
        res.send(response);
    });
});

router.post('/saved-categories-on-edit', function(req, res, next) {
    var data = {};
    data = req.body.data;
    data.summary = "Summary";
    isIdUnique(data.title, data.incidentId).then(isUnique => {
        if (isUnique) {
            model.class.create(data).then(function(response) {
                res.send(response);
            });
        }
    });
});



router.post('/save', function(req, res, next) {

    var data = req.body.data;

    model.incident.findOne({where: {id: data.incidentId}}).then(function(incident){

        incident.countClasses().then(function(nextIndex){
            data.index = nextIndex;
            data.userAccountId = req.user.userAccountId;
            model.class.create(data).then(function(response) {
				var io = req.app.get('io');
				var data = {
					data: response,
					action: "new"
				}
				io.emit('incident_class:' + incident.id,data)
                res.send(response);
            });
        });
    });
});

function setSocketForClasses(cls, incidentId, action){
	// var io = req.app.get('io');
	// io.emit('incident_update:' + incidentId,{})
}

router.post('/new-message', function(req, res, next) {

    var class_id = req.body.class_id;
    var incident_id = req.body.incident_id;
    var msg = req.body.msg;
    var data = {
        classId: class_id,
        incidentId: incident_id,
        content: msg.message,
        userId: msg.userId,
        editorId: req.user.id,
        messageId: msg.id,
        index: msg.index,
        createdAt: msg.createdAt,
        status: true
    };

    model.message.findOne({where: {id: msg.id}}).then(function(msg){
        msg.status = "sorted";
        msg.save();
        model.message_history.create(data).then(function(message) {
            message.getUser().then(function(user){
                var msg = message.toJSON();
				if(user)
                msg.user = user.toJSON();
				console.log('new-message',msg.incidentId);
				var io = req.app.get('io');
				io.emit('incident_class_message:' + msg.incidentId,{})
                // broadcastClass(class_id);
                res.send(msg);
            });
        });
    });

});

function broadcastClass(classId){

  model.class.findOne({
    where: {id: classId}
  }).then(function(cls){
    var data = {};
    data.type = "incident_update:"+cls.incidentId;
    data.class = cls;
    socket.notify(data.type, data);
  });

}

router.post('/update', function(req, res, next) {
    model.class.update(req.body.data, {where: { id : req.body.data.id }, returning: true, raw: true}).then(function(response) {
		var io = req.app.get('io');
		var data = {
			data: response[1][0],
			action: "update"
		}
		io.emit('incident_class:' + response[1][0].incidentId,data)
        res.send(response);
    })
});

router.delete('/remove/:id/:incidentId', function(req, res, next) {
	var io = req.app.get('io');
    model.class.destroy({where: { id : req.params.id }}).then(function(response) {
		var data = {
			data: { classId: req.params.id },
			action: "delete"
		}
		io.emit('incident_class:' + req.params.incidentId,data)
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.class.update({isDeleted:true},{where: { id : req.params.id }}).then(function(response) {
			var data = {
				data: {classId: req.params.id},
				action: "delete"
			}
			io.emit('incident_class:' + req.params.incidentId,data)
            res.send({success:true, msg:response.toString()});
        })
    });
});

//'sub-class' api routes
router.get('/sub-class/all', function(req, res, next) {
    model.sub_class.findAll({ where: {
        classId: req.query.classId,
        isDeleted: false,
        status: true
    }}).then(function(response) {
        res.send(response);
    });
});

router.post('/sub-class/save', function(req, res, next) {
    model.sub_class.create(req.body.data).then(function(response) {
        res.send(response);
    })
});

//not in use
router.post('/save-color', function(req, res, next) {
    var id = req.body.data.id;
    var color = req.body.data.color;
    model.message_history.update({selectedColor: color}, {where: {id: id}}).then(function(response) {
        res.send(response);
    });
});
//not in use
router.post('/update-index', function(req, res, next) {
    var data = req.body.index;
    _.each(data, function(item){
        model.class.update({
            index: item.index
        },
        {where: {id: item.id}
    });
});
res.json();
});
//not in use
router.post('/sub/update', function(req, res, next) {
    model.sub_class.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    })
});
//not in use
router.post('/category/save', function(req, res, next) {
    model.class.create(req.body.data).then(function(response) {
        res.send(response);
    });
});
//not in use
router.get('/all-categories', function(req, res, next) {
    console.log(req.user);
    model.class.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted: false},
        include: {model: model.incident}
    }).then(function(result) {
        res.json(result);
    });
});

module.exports = router;
