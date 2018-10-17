var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');
var socket = require('../../lib/socket');

router.get('/get', function (req, res, next) {
	model.incident_plan.findOne({
		where: {
			actionPlanId: req.query.actionPlanId,
			incidentId: req.query.incidentId
		},
		include: [
			{
				model: model.action_plan,
				attributes: ['id', 'name', 'description', 'status', 'type', 'plandate', 'categoryId','kind']
			},
			{
				model: model.incident_activity,
				attributes: ['id', 'status']
			},
            {
                model: model.incident_agenda_activity,
                attributes: ['id', 'status']
            }
		]
	}).then(function (response) {
		res.send(response);
	});
});

router.get('/user-tasks', function (req, res, next) {
	model.incident_plan.findOne({
		where: { incidentId: req.query.incidentId, selected: true }
	}).then(function (incidentPlan) {
		if(incidentPlan){
			model.incident_activity.findAll({
				where: {incident_plan_id: incidentPlan.id, responseActorId: req.user.id, activated: true,isDeleted: false},
				attributes: ['id', 'name', 'description', 'responsibility_level', 'index', 'status', 'activated', 'statusAt']
			}).then(function(activities){
				res.send(activities);
			});
		}
		else{
			res.send([]);
		}
	});
});

router.get('/get-activities', function (req, res, next) {
    model.incident_plan.findOne({
        where: { id: req.query.id },
        attributes: ['id'],
        include: [{
            model: model.incident_activity,
            attributes: ['id', 'type', 'name', 'description', 'responsibility_level','default', 'copy', 'activated', 'status', 'index', 'activatedAt', 'statusAt', 'createdAt'],
            include: [
                {
                    model: model.organization,
                    attributes: ['id', 'name']
                },
                {
                    model: model.role,
                    attributes: ['id', 'name']
                },
                {
                    model: model.department,
                    attributes: ['id', 'name']
                },
                {
                    model: model.user, as: 'response_actor',
                    foreignKey: 'responseActorId',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone'],
                    include: [{
                        model: model.department,
                        attributes: ['id', 'name']
                    }]
                },
                {
                    model: model.incident_outcome,
                    attributes: ['id', 'name'],
                    include: [{
                        model: model.incident_activity, as: 'outcome_activity', foreignKey: 'outcome_activity_id',
                        include: [
                            {
                                model: model.organization,
                                attributes: ['id', 'name']
                            },
                            {
                                model: model.role,
                                attributes: ['id', 'name']
                            },
                            {
                                model: model.department,
                                attributes: ['id', 'name']
                            },
                            {
                                model: model.user,
                                as: 'response_actor',
                                foreignKey: 'responseActorId',
                                attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone']
                            }
                        ]
                    }]
                }
            ]
        }]
    }).then(function (response) {
        res.send(response);
    });
});

router.post('/save', function (req, res, next) {
    var record = req.body;
    model.incident_plan.create(record)
    .then(function (incidentPlan) {
        model.incident_plan.update({ selected: false },
            {
                where: {
                    actionPlanId: { $ne: record.actionPlanId },
                    incidentId: record.incidentId,
                    selected: true
                }
            }).then(function (result) {
                model.action_plan.findOne({
                    where: { id: record.actionPlanId },
                    include: [{
                        model: model.plan_activities,

                        include: [{
                            model: model.activity,
                            attributes: ['id', 'type', 'description', 'responsibility_level', 'response_time', 'completion_time'],
                            include: [{ model: model.task_list, attributes: ['id', 'title'] },
                            { model: model.organization, attributes: ['id'] },
                            { model: model.role, attributes: ['id'] },
                            { model: model.department, attributes: ['id'] },
                            { model: model.user, as: 'response_actor', attributes: ['id'] },
                            { model: model.user, as: 'backup_actor', attributes: ['id'] },
                            { model: model.user, as: 'accountable_actor', attributes: ['id'] },
                            {
                                model: model.outcome, attributes: ['id', 'name'],
                                include: [{
                                    model: model.activity, as: 'outcome_activity', foreignKey: 'outcome_activity_id',
                                    attributes: ['id', 'type', 'description', 'responsibility_level', 'response_time', 'completion_time'],
                                    include: [{ model: model.task_list, attributes: ['id', 'title'] },
                                    { model: model.organization, attributes: ['id', 'name'] },
                                    { model: model.role, attributes: ['id', 'name'] },
                                    { model: model.department, attributes: ['id', 'name'] },
                                    { model: model.user, as: 'response_actor', attributes: ['firstName', 'lastName', 'email'] },
                                    { model: model.user, as: 'backup_actor', attributes: ['email'] },
                                    {
                                        model: model.user, as: 'accountable_actor', attributes: ['email']
                                    }]
                                }]
                            }]
                        }]
                    }]
                }).then(function (actionPlan) {
                    var incidentActivities = [];
                    _.each(actionPlan.plan_activities, function (planActivity) {
                        incidentActivities.push(model.incident_activity.create({
                            type: planActivity.activity.type,
                            name: planActivity.activity.task_list ? planActivity.activity.task_list.title : 'N/A',
                            description: planActivity.activity.description,
                            responsibility_level: planActivity.activity.responsibility_level,
                            response_time: planActivity.activity.response_time,
                            completion_time: planActivity.activity.completion_time,
                            default: planActivity.default,
                            copy: true,
                            activated: false,
                            status: 'incomplete',
                            index: planActivity.index,
                            tindex: planActivity.tindex,
                            activity_id: planActivity.activity.id,
                            incident_plan_id: incidentPlan.id,
                            incident_id: record.incidentId,
                            action_plan_id: record.actionPlanId,
                            departmentId: planActivity.activity.department ? planActivity.activity.department.id : null,
                            roleId: planActivity.activity.role ? planActivity.activity.role.id : null,
                            organizationId: planActivity.activity.organization ? planActivity.activity.organization.id : null,
                            backupActorId: planActivity.activity.backup_actor ? planActivity.activity.backup_actor.id : null,
                            responseActorId: planActivity.activity.response_actor ? planActivity.activity.response_actor.id : null,
                            accountableActorId: planActivity.activity.accountable_actor ? planActivity.activity.accountable_actor.id : null,
                            userAccountId: req.user.userAccountId,
                            taskListId: planActivity.activity.task_list ? planActivity.activity.task_list.id : null,
                            planActivityId: planActivity.id,
                            sectionId: planActivity.sectionId
                        }));
                    });

                    Q.allSettled(incidentActivities).then(function (res) {
                        incidentActivities = _.map(res, function (incidentActivity) {
                            return incidentActivity.value;
                        });
                    });

                    Q.allSettled(incidentActivities).done(function (results) {
                        var toBeOutcomes = [];
                        actionPlan.plan_activities.forEach(function (planActivity) {
                            if (planActivity.activity.type === 'decision') {
                                planActivity.activity.outcomes.forEach(function (outcome) {
                                    var decisionFound = incidentActivities.find(incidentActivity => incidentActivity.activity_id === planActivity.activity.id);

                                    var filteredIncidentActivity = incidentActivities.find(incidentActivity => incidentActivity.activity_id === outcome.outcome_activity.id);
                                    if (filteredIncidentActivity) {
                                        var toBeOutcome = filteredIncidentActivity;
                                    } else {
                                        var toBeOutcome = {
                                            type: 'outcome',
                                            name: outcome.outcome_activity.task_list.title,
                                            description: outcome.outcome_activity.description,
                                            responsibility_level: outcome.outcome_activity.responsibility_level,
                                            response_time: outcome.outcome_activity.response_time,
                                            completion_time: outcome.outcome_activity.completion_time,
                                            copy: true,
                                            activated: false,
                                            status: 'incomplete',
                                            activity_id: outcome.outcome_activity.id,
                                            incident_plan_id: incidentPlan.id,
                                            incident_id: record.incidentId,
                                            action_plan_id: record.actionPlanId,
                                            departmentId: outcome.outcome_activity.department ? outcome.outcome_activity.department.id : null,
                                            roleId: outcome.outcome_activity.role ? outcome.outcome_activity.role.id : null,
                                            organizationId: outcome.outcome_activity.organization ? outcome.outcome_activity.organization.id : null,
                                            backupActorId: outcome.outcome_activity.backup_actor ? outcome.outcome_activity.backup_actor.id : null,
                                            responseActorId: outcome.outcome_activity.response_actor ? outcome.outcome_activity.response_actor.id : null,
                                            accountableActorId: outcome.outcome_activity.accountable_actor ? outcome.outcome_activity.accountable_actor.id : null,
                                            userAccountId: req.user.userAccountId,
                                            taskListId: outcome.outcome_activity.task_list.id
                                        }
                                    }
                                    toBeOutcomes.push({ decision: decisionFound, outcome: toBeOutcome, name: outcome.name });
                                })
                            }
                        })
						var data = incidentPlan.toJSON();
						var io = req.app.get('io');
						var response = {
							data: data,
							action: 'new'
						}
						io.emit('incident_plan:' + data.incidentId,response)
                        res.send({outcomes: toBeOutcomes, incidentPlan: incidentPlan});
                    });
                });
            })
        });
    });

router.post('/save-agenda-activities', function (req, res, next) {
    var record = req.body;
    model.incident_plan.create(record)
    .then(function (incidentPlan) {
        model.incident_plan.update({ selected: false },
            {
                where: {
                    actionPlanId: { $ne: record.actionPlanId },
                    incidentId: record.incidentId,
                    selected: true
                }
            }).then(function (result) {
                model.action_plan.findOne({
                    where: { id: record.actionPlanId },
                    include: [{
                        model: model.agendaPoint,
                    
                        include: [{
                            model: model.agenda_activity,

                            include: [{
                                model: model.activity,
                                attributes: ['id', 'type', 'description', 'responsibility_level', 'response_time', 'completion_time'],
                                include: [{ model: model.task_list, attributes: ['id', 'title'] },
                                { model: model.organization, attributes: ['id'] },
                                { model: model.role, attributes: ['id'] },
                                { model: model.department, attributes: ['id'] },
                                { model: model.user, as: 'response_actor', attributes: ['id','firstName', 'lastName', 'email'] },
                                { model: model.user, as: 'backup_actor', attributes: ['id'] },
                                { model: model.user, as: 'accountable_actor', attributes: ['id'] }]
                            }]
                        }]
                    }]
                }).then(function (actionPlan) {
                    var incidentAgendaActivities = [];
                    _.each(actionPlan.agendaPoints, function (agendapoint) {
                        var toData = {
                            name: agendapoint.name,
                            description: agendapoint.description,
                            responsibilityLevel: agendapoint.responsibilityLevel,
                            allCategoryId: agendapoint.allCategoryId,
                            agendaPointId: agendapoint.id,
                            incident_plan_id: incidentPlan.id,
                            userAccountId: req.user.userAccountId
                        }
                        model.incident_agenda_point.create(toData).then(function(incident_agenda) {
                            _.each(agendapoint.agenda_activities, function (agendaActivity) {
                                incidentAgendaActivities.push(model.incident_agenda_activity.create({
                                    type: agendaActivity.activity.type,
                                    name: agendaActivity.activity.task_list ? agendaActivity.activity.task_list.title : 'N/A',
                                    description: agendaActivity.activity.description,
                                    responsibility_level: agendaActivity.activity.responsibility_level,
                                    response_time: agendaActivity.activity.response_time,
                                    completion_time: agendaActivity.activity.completion_time,
                                    default: agendaActivity.default,
                                    copy: true,
                                    activated: false,
                                    status: 'incomplete',
                                    index: agendaActivity.index,
                                    tindex: agendaActivity.tindex,
                                    activityId: agendaActivity.activity.id,
                                    incident_plan_id: incidentPlan.id,
                                    incidentId: record.incidentId,
                                    actionPlanId: record.actionPlanId,
                                    departmentId: agendaActivity.activity.department ? agendaActivity.activity.department.id : null,
                                    roleId: agendaActivity.activity.role ? agendaActivity.activity.role.id : null,
                                    organizationId: agendaActivity.activity.organization ? agendaActivity.activity.organization.id : null,
                                    backupActorId: agendaActivity.activity.backup_actor ? agendaActivity.activity.backup_actor.id : null,
                                    responseActorId: agendaActivity.activity.response_actor ? agendaActivity.activity.response_actor.id : null,
                                    accountableActorId: agendaActivity.activity.accountable_actor ? agendaActivity.activity.accountable_actor.id : null,
                                    userAccountId: req.user.userAccountId,
                                    taskListId: agendaActivity.activity.task_list ? agendaActivity.activity.task_list.id : null,
                                    agendaActivityId: agendaActivity.id,
                                    incidentAgendaPointId: incident_agenda.id,
                                }));
                            });
                        });
                    });
                    Q.allSettled(incidentAgendaActivities).done(function (resp) {
                        var data = incidentPlan.toJSON();
                        var io = req.app.get('io');
                        var response = {
                            data: data,
                            action: 'new'
                        }
                        io.emit('incident_plan:' + data.incidentId,response)
                        res.send({ incidentPlan: incidentPlan });
                    });
                    
                });
            })
        });
    });

router.post('/add-outcomes', function (req, res, next) {
    var records = req.body;
    var outcomes = [];
    _.each(records, function (toBeOutcome) {
        outcomes.push(model.incident_activity.findOrCreate({
            where: { id: toBeOutcome.outcome.id },
            defaults: {
                type: toBeOutcome.outcome.type,
                name: toBeOutcome.outcome.name,
                description: toBeOutcome.outcome.description,
                responsibility_level: toBeOutcome.outcome.responsibility_level,
                response_time: toBeOutcome.outcome.response_time,
                completion_time: toBeOutcome.outcome.completion_time,
                copy: true,
                activated: false,
                status: 'incomplete',
                activity_id: toBeOutcome.outcome.activity_id,
                incident_plan_id: toBeOutcome.outcome.incident_plan_id,
                incident_id: toBeOutcome.outcome.incident_id,
                action_plan_id: toBeOutcome.outcome.action_plan_id,
                departmentId: toBeOutcome.outcome.departmentId,
                roleId: toBeOutcome.outcome.roleId,
                organizationId: toBeOutcome.outcome.organizationId,
                backupActorId: toBeOutcome.outcome.backupActorId,
                responseActorId: toBeOutcome.outcome.responseActorId,
                accountableActorId: toBeOutcome.outcome.accountableActorId,
                userAccountId: toBeOutcome.outcome.userAccountId,
                taskListId: toBeOutcome.outcome.taskListId
            }
        }));
    });

    Q.allSettled(outcomes).then(function (res) {
        _.map(res, function (outcomeActivity, index) {
            model.incident_outcome.create({
                name: records[index].name,
                decision_activity_id: records[index].decision.id,
                outcome_activity_id: outcomeActivity.value[0].id
            })
        })
    });

    Q.allSettled(outcomes).done(function (results) {
        res.send(outcomes);
    });
});

router.post('/update', function (req, res, next) {
	console.log("update");
    var record = req.body;
    model.incident_plan.update({ selected: true }, {
        where: {
            actionPlanId: record.actionPlanId,
            incidentId: record.incidentId
        }
    }).then(function (response) {
        model.incident_plan.update({ selected: false },{
            where: {
                actionPlanId: { $ne: record.actionPlanId },
                incidentId: record.incidentId,
                selected: true
            }
        }).then(function (result) {
            model.incident_plan.findOne({
                where: {
                    actionPlanId: record.actionPlanId,
                    incidentId: record.incidentId
                },
                attributes: ['id', 'plan_activated', 'actionPlanId', 'selected','incidentId']
            }).then(function (response) {
				var io = req.app.get('io');
				res.send(response);
				var data = response.toJSON();
				console.log('incident_plan',data);
				var response = {
					data: data,
					action: 'changePlan'
				}
				io.emit('incident_plan:' + data.incidentId,response)
            });
        })
    });
});


router.post('/save-agenda-point', function(req, res, next) {
    var record = req.body;
    record.userAccountId = req.user.userAccountId;
    model.incident_agenda_point.create(record).then(function (point) {
        model.incident_agenda_point.findOne({ where: { id: point.id },
            include : [{  
                model : model.incident_agenda_activity,
                    include : [{    model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'available',
                        'role', 'title', 'officePhone', 'mobilePhone'],
                        }]
                    },{
                model : model.all_category
            }]
        }).then(function (response) {
            res.send(response);
        });
    });
});

router.delete('/delete-agenda-point/:id', function(req, res, next) {
    model.incident_agenda_point.destroy({
        where: {id: req.params.id}
    }).then(function(response){
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.incident_agenda_point.update({isDeleted:true},{
            where: {id: req.params.id}
        }).then(function(response){
            res.send({success:true, msg:response.toString()});
        })
    })
});

router.post('/check-combination-presence', function (req, res, next) {
    var record = req.body;
    model.incident_plan.findOne({ where: { actionPlanId: record.actionPlanId, incidentId: record.incidentId } })
    .then(function (incidentPlan) {
        res.send(incidentPlan);
    });
});

router.post('/update-t-index', function (req, res, next) {
    model.incident_activity.update({index: req.body.index}, { where: { id: req.body.id } })
    .then(function (response) {
        model.incident_activity.findOne({where: {id: req.body.id}}).then(function(inci){
            var data = {};
            data.type = "incident_activity_update:" + inci.incident_plan_id;
            data.activity = inci;
            socket.notify( data.type, data);
        });
        res.send(response);
    });
});

router.get('/get-selected-outcomes', function (req, res, next) {
    model.incident_plan.findOne({
        where: { actionPlanId: req.query.actionPlanId, incidentId: req.query.incidentId },
        attributes: ['id', 'activity_status']
    }).then(function (response) {
        var activities = []
        _.each(response.activity_status, function (incidentActivity) {
            if (incidentActivity.outcomes.length > 0 && incidentActivity.selected_outcome) {
                activities.push(model.activity.findOne({
                    where: { id: incidentActivity.selected_outcome },
                    attributes: ['id', 'type', 'description'],
                    include: [{
                        model: model.task_list,
                        attributes: ['title']
                    }, {
                        model: model.user, as: 'response_actor',
                        attributes: ['id', 'firstName', 'lastName', 'available']
                    }]
                }));
            }
        });
        Q.allSettled(activities).then(function (res) {
            activities = _.map(res, function (outcome) {
                return outcome.value;
            });
        });

        Q.allSettled(activities).done(function (results) {
            var data = {}
            data.activities = activities;
            res.send(data);
        });
    });
});

router.delete('/delete/:id', function(req, res, next) {
    model.incident_plan.findOne({
        where: {id: req.params.id},
        include: [{model: model.incident},{model: model.incident_activity, attributes: ['id']},{model: model.incident_agenda_activity, attributes: ['id']}]
    }).then(function(incidentPlan){
        var destroyActivity = [];
        if (incidentPlan && incidentPlan.kind == 'activities'){
            _.each(incidentPlan.incident_activities, function(activity){
                destroyActivity.push(model.incident_activity.destroy({where: {id: activity.id}}));
            });
            
        }else{
            _.each(incidentPlan.incident_agenda_activities, function(activity){
                destroyActivity.push(model.incident_agenda_activity.destroy({where: {id: activity.id}}));
            });
        }
        Q.allSettled(destroyActivity).then(function(){
            // incidentPlan.destroy().then(function(response){
            //     var data = {};
            //     data.type = "incident_plan_unlink:" + incidentPlan.incidentId;
            //     data.plan = incidentPlan;
            //     socket.notify(data.type, data);
            //     res.send({success:true, msg:response.toString()});
            // },function(response){
                incidentPlan.update({isDeleted:true}).then(function(response){
                    var response = {
                        data: {planId: incidentPlan.id, incidentId: incidentPlan.incidentId},
                        action: 'delete'
                    }
                    req.app.get('io').emit("incident_plan_unlink:" + incidentPlan.incidentId,response)
                    req.app.get('io').emit("incident_plan_unlink:" + incidentPlan.incident.userAccountId,response)
                    res.send({success:true, msg:response.toString()});
                });
            // });

        })
    }).catch(function (response) {
        res.send({success:false, msg:response.toString()});
    });
});

//not in use
router.get('/all', function (req, res, next) {
    model.incident_plan.findAll({ where: { organizationId: req.query.orgId,isDeleted: false } }).then(function (response) {
        res.send(response);
    });
});
//not in use
router.post('/status-update', function (req, res, next) {
    var data = req.body
    model.incident_plan.findOne({ where: { id: data.id } })
    .then(function (incidentPlan) {
        incidentPlans.forEach(function (incidentPlan) {
            incidentPlan.activity_status.forEach(function (activity_status) {
                if (activity_status.activityId === data.activityId &&
                    activity_status.type === data.activityType) {
                    activity_status.task_status = data.activityStatus;
                }
            });
        });

        model.incident_plan.update({ activity_status: incidentPlan.activity_status },
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

module.exports = router;
