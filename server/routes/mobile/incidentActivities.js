var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');
var sequelize = require('sequelize');
var socket = require('../../lib/socket');
router.post('/update', function (req, res, next) {
    var record = req.body;
    model.incident_activity.update(record.activity, { where: { id: record.activity.id } })
        .then(function (result) {

            model.incident_activity.findOne({
                where: { id: record.activity.id },
                attributes: ['id', 'type', 'name', 'description', 'responsibility_level', 'default', 'incident_id','incident_plan_id',
                    'copy', 'activated', 'status', 'index', 'activatedAt', 'statusAt', 'createdAt'],
                include: [{ model: model.organization, attributes: ['id', 'name'] },
                    { model: model.role, attributes: ['id', 'name'] },
                    { model: model.department, attributes: ['id', 'name'] },
                    { model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone'],
                        include: [{ model: model.department, attributes: ['id', 'name'] }]
                    },
                    { model: model.incident_outcome, attributes: ['id', 'name'],
                        include: [{ model: model.incident_activity, as: 'outcome_activity', foreignKey: 'outcome_activity_id',
                            include: [{ model: model.organization, attributes: ['id', 'name'] },
                                { model: model.role, attributes: ['id', 'name'] },

                                { model: model.department, attributes: ['id', 'name'] },
                                { model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                                    attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone']
                                }]
                        }]
                    }]
            }).then(function (response) {
                // var data = {};
                // data.type = "incident_activity_update";
                // data.activity = {};
                // data.activity = response;
                // var owner = CH.wss._server._handle.owner;
                // CH.wss.broadcast(JSON.stringify(data), owner);
                console.log(response);
                var data = {};
                data.type = "incident_activity_update:" + response.incident_plan_id;
                data.activity = response;
                socket.notify( data.type, data);
                res.send(response);
            });
        })
});

router.get('/userActivities', function (req, res, next) {
    model.incident_activity.findAll({
        where: { responseActorId: req.user.id },
        attributes: ['id', 'type', 'name', 'description', 'responsibility_level', 'default',
            'copy', 'activated', 'status', 'index', 'activatedAt', 'statusAt', 'createdAt'],
        include: [{ model: model.organization, attributes: ['id', 'name'] },
            { model: model.role, attributes: ['id', 'name'] },
            { model: model.department, attributes: ['id', 'name'] },
            { model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone'],
                include: [{ model: model.department, attributes: ['id', 'name'] }]
            },

            { model: model.incident_outcome, attributes: ['id', 'name'],
                include: [{ model: model.incident_activity, as: 'outcome_activity', foreignKey: 'outcome_activity_id',
                    include: [{ model: model.organization, attributes: ['id', 'name'] },
                        { model: model.role, attributes: ['id', 'name'] },

                        { model: model.department, attributes: ['id', 'name'] },
                        { model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                            attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone']
                        }]
                }]
            },
            { model: model.task_list,
                attributes: ['id', 'links', 'description'],
                include: [{model: model.library_reference,
                    attributes: ['id', 'title', 'author', 'description', 'filename', 'url', 'type', 'mimetype']
                }]
            }
        ]
    }).then(function (response) {
        res.send(response);
    });
});

module.exports = router;
