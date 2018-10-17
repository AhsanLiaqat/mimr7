var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.post('/statusUpdate', function (req, res, next) {
    var data = req.body
    model.incident_plan.findOne({ where: { id: data.id } })
        .then(function (incidentPlan) {
            incidentPlan.activity_status.forEach(function(activity_status){
                if (activity_status.activityId === data.activityId &&
                    activity_status.type === data.activityType){
                    activity_status.task_status = data.activityStatus;
                }
            });
            model.incident_plan.update({activity_status: incidentPlan.activity_status},
                { where: { id: incidentPlan.id } })
                .then(function (response) {
                    model.incident_plan.findOne({ where: { id: incidentPlan.id } })
                        .then(function (incidentPlan) {
                            var data = {};
                            data.type = "plan_status";
                            data.plan = incidentPlan;
                            var owner = CH.wss._server._handle.owner;
                            CH.wss.broadcast(JSON.stringify(data), owner);
                            res.send(response);
                        });
                });
        });
});

router.get('/userTasks', function (req, res, next) {
    model.incident_plan.findOne({
        where: { incidentId: req.query.incidentId, selected: true }
    }).then(function (incidentPlan) {
        if(incidentPlan){
            model.incident_activity.findAll({
                where: {incident_plan_id: incidentPlan.id, responseActorId: req.query.userId, activated: true},
                attributes: ['id', 'name', 'description', 'responsibility_level', 'index', 'status', 'activated', 'statusAt'],
                include: [{model: model.task_list,
                    attributes: ['id', 'links', 'description'],
                    include: [{model: model.library_reference,
                        attributes: ['id', 'title', 'author', 'description', 'filename', 'url', 'type', 'mimetype']
                    }]
                }]
            }).then(function(activities){
                res.send(activities);
            });
        }else{
            return res.status(304).send('No Incident Plan found.');
        }
    });
});

module.exports = router;
