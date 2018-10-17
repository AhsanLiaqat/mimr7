var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');
var sequelize = require('sequelize');
var moment = require('moment');
var socket = require('../../lib/socket');
var io = process.io; 
var schedule = require('node-schedule');

var j = schedule.scheduleJob('05 * * * * *', function(){
    model.incident_activity.findAll({
        where: {activated: true,isDeleted:false},
        attributes: ['id', 'activated', 'status', 'activatedAt', 'response_time', 'completion_time']
    }).then(function(activities) {

        activities.forEach(function(act) {
            var activation = new Date(act.activatedAt);

            if( act.response_time >= 0 && act.status == 'na' &&
                new Date(activation.getTime() + act.response_time*60*1000).getFullYear() == new Date().getFullYear() &&
                new Date(activation.getTime() + act.response_time*60*1000).getMonth() == new Date().getMonth() &&
                new Date(activation.getTime() + act.response_time*60*1000).getDay() == new Date().getDay() &&
                new Date(activation.getTime() + act.response_time*60*1000).getHours() == new Date().getHours() &&
                new Date(activation.getTime() + act.response_time*60*1000).getMinutes() == new Date().getMinutes()
            ){

            }
            if( act.response_time >= 0 && act.status != 'complete' && act.status != 'overdue' &&
                new Date(activation.getTime() + act.completion_time*60*1000).getFullYear() == new Date().getFullYear() &&
                new Date(activation.getTime() + act.completion_time*60*1000).getMonth() == new Date().getMonth() &&
                new Date(activation.getTime() + act.completion_time*60*1000).getDay() == new Date().getDay() &&
                new Date(activation.getTime() + act.completion_time*60*1000).getHours() == new Date().getHours() &&
                new Date(activation.getTime() + act.completion_time*60*1000).getMinutes() == new Date().getMinutes()
            ){
               var data = {
                status: 'overdue'
               }
               model.incident_activity.update(data, { where: { id: act.id } })
                .then(function (result) {
                    model.incident_activity.findOne({
                        where: { id: act.id },
                        attributes: ['id', 'type', 'name', 'description', 'responsibility_level', 'default', 'incident_plan_id',
                            'incident_id', 'copy', 'activated', 'status', 'index', 'activatedAt', 'statusAt', 'createdAt', 'tindex'],
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
                    }).then(function (data) {
                        var response = {
                            data: data,
                            action: 'update'
                        }
                        io.emit('incident_activity_update:' + data.incident_plan_id,response)
                        res.send(data);
                    });
                })
            }
        });
    });
});

router.post('/set-active', function (req, res, next) {
    var record = req.body;
    var activities = [];
    _.each(record.ids, function (activityId) {
        activities.push(model.incident_activity.update(
            { activated: true, activatedAt: moment.utc().toDate() },
            { where: { id: activityId } }
        ));
    });

    Q.allSettled(activities).then(function (res) {
        activities = _.map(res, function (activity) {
            return plan_activity.value;
        });
    });

    Q.allSettled(activities).done(function (results) {
        res.send(activities);
    });
});

router.post('/set-inactive', function (req, res, next) {
    var record = req.body;
    var activities = [];
    _.each(record.ids, function (activityId) {
        activities.push(model.incident_activity.update(
            { activated: false, activatedAt: moment.utc().toDate() },
            { where: { id: activityId } }
        ));
    });

    Q.allSettled(activities).then(function (res) {
        activities = _.map(res, function (activity) {
            return plan_activity.value;
        });
    });

    Q.allSettled(activities).done(function (results) {
        res.send(activities);
    });
});

router.post('/update', function (req, res, next) {
    var record = req.body;
    if(record.activated == false){
        delete record.activatedAt;
    }
    model.incident_activity.update(record.activity, { where: { id: record.activity.id } })
        .then(function (result) {

            model.incident_activity.findOne({
                where: { id: record.activity.id },
                attributes: ['id', 'type', 'name', 'description', 'responsibility_level', 'default', 'incident_plan_id',
                    'incident_id', 'copy', 'activated', 'status', 'index', 'activatedAt', 'statusAt', 'createdAt', 'tindex'],
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
            }).then(function (data) {
				console.log(data.incident_plan_id);
				var io = req.app.get('io');
				var response = {
					data: data,
					action: 'update'
				}
				io.emit('incident_plan_activity:' + data.incident_plan_id,response)
                res.send(data);
            });
        })
});

function setActivitySocketActionPlanDashboard(req, activityId){
    model.incident_activity.findOne({
        where: { id: activityId },
        attributes: ['id', 'type', 'name', 'description', 'responsibility_level', 'default', 'incident_plan_id',
            'incident_id', 'copy', 'activated', 'status', 'index', 'activatedAt', 'statusAt', 'createdAt', 'tindex'],
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
    }).then(function (data) {
		var io = req.app.get('io');
		var response = {
			data: data,
			action: 'update'
		}
		io.emit('incident_plan_activity:' + data.incident_plan_id,response)
    });

}

router.put('/update-actor/:id', function (req, res, next) {
    console.log("update user ");
    var record = req.body;
    model.incident_activity.update({responseActorId: record.responseActorId},
        { where: { id: req.params.id } })
        .then(function(data){
            setActivitySocketActionPlanDashboard(req,req.params.id);
            res.send(200);
        });
});



router.post('/create', function (req, res, next) {
    var record = req.body.data;
    model.incident_activity.create(record.activity)
        .then(function (incidentActivity) {
            model.incident_plan.findOne({
                where: { id: incidentActivity.incident_plan_id },
                attributes: ['id'],
                include: [{
                    model: model.incident_activity,
                    attributes: ['id', 'type', 'name', 'index']
                }]
            }).then(function (incidentPlan) {
                var activities = []

                _.each(incidentPlan.incident_activity, function (activity) {
                    activity.increment('index');
                });

                Q.allSettled(activities).then(function (res) {
                    activities = _.map(res, function (activity) {
                        return activity.value;
                    });
                });

                Q.allSettled(activities).done(function (results) {
                    model.incident_activity.findOne({
                        where: { id: incidentActivity.id },
                        attributes: ['id', 'type', 'name', 'description', 'responsibility_level',
                            'default', 'copy', 'activated', 'status', 'index', 'activatedAt',
                            'statusAt', 'createdAt'],
                        include: [{ model: model.organization, attributes: ['id', 'name'] },
                            { model: model.role, attributes: ['id', 'name'] },
                            { model: model.department, attributes: ['id', 'name'] },
                            {
                                model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                                attributes: ['id', 'firstName', 'lastName', 'email', 'available',
                                    'role', 'title', 'officePhone', 'mobilePhone'],
                                include: [{ model: model.department, attributes: ['id', 'name'] }]
                            },
                            {
                                model: model.incident_outcome, attributes: ['id', 'name'],
                                include: [{

                                    model: model.incident_activity, as: 'outcome_activity', foreignKey: 'outcome_activity_id',
                                    include: [{ model: model.organization, attributes: ['id', 'name'] },
                                        { model: model.role, attributes: ['id', 'name'] },

                                        { model: model.department, attributes: ['id', 'name'] },

                                        {
                                            model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                                            attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone']
                                        }]
                                }]
                            }]
                    }).then(function (response) {
                        res.send(response);
                    });
                });
            });
        });
});

router.get('/get', function (req, res, next) {
    model.incident_activity.findOne({
        where: { id: req.query.id,isDeleted: false },
        include: [{ model: model.organization, attributes: ['id', 'name'] },
            { model: model.role, attributes: ['id', 'name'] },
            { model: model.department, attributes: ['id', 'name'] }]
    }).then(function (incidentActivity) {
        res.send(incidentActivity);
    })
});

router.get('/get-task/:id', function (req, res, next) {
    console.log('came into site: ', req.params.id);
    model.incident_activity.findOne({
        where: { id: req.params.id,isDeleted: false },
        attributes: ['id', 'name'],
        include: [{ model: model.task_list,
            attributes: ['id', 'title', 'description', 'links'],
            include: [{model: model.library_reference,
                attributes: ['id', 'title', 'author', 'description', 'filename', 'url', 'type', 'mimetype']
            }]
        }]
    }).then(function (incidentActivity) {
        res.send(incidentActivity);
    })
});

router.delete('/delete/:id', function (req, res, next) {
	var io = req.app.get('io');
	model.incident_activity.findOne({
		where: {
			id: req.params.id
		},
		attributes:['incident_plan_id','incident_id','sectionId']
	}).then(function(response){
		if(response){
			response = response.toJSON();
			var data = {
				id: req.params.id,
				incidentPlanId:response.incident_plan_id,
				incidentId: response.incident_id,
				sectionId: response.sectionId
			}
			console.log("Response---->",data);
		}
		model.incident_activity.destroy({
			where: {id: req.params.id}
		}).then(function(resp){
			var response = {
				data: data,
				action: 'delete'
			}
			io.emit('incident_plan_activity:' + data.incidentPlanId,response)
			res.send({success:true, msg:resp.toString()});
		},function(response){
			model.incident_activity.update({isDeleted:true},{
				where: {id: req.params.id}
			}).then(function(resp){
				var response = {
					data: data,
					action: 'delete'
				}
				io.emit('incident_plan_activity:' + data.incidentPlanId,response)
				res.send({success:true, msg:resp.toString()});
			})
		})
	})
});

module.exports = router;
