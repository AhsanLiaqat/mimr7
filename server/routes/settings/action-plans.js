var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DB_URL, {logging: false});

router.get('/get', function (req, res, next) {
    model.action_plan.findOne({
        where: { id: req.query.id }
    }).then(function (response) {
        res.send(response);
    });
});
router.get('/lookup', function (req, res, next) {
    model.action_plan.findAll({ where: { userAccountId: req.user.userAccountId,isDeleted:false },
        attributes: ['id' , 'name' , 'createdAt','active','kind'],
        order: [
            ['name', 'ASC']
        ],
    })
    .then(function (response) {
        res.send(response);
    });
});

router.get('/get-agenda-points', function(req, res, next) {
    model.action_plan.findOne({where: {id: req.query.id},
        order: [
            ['name', 'ASC']
        ],
        include:[{model : model.agendaPoint,
            include:[{
                model: model.agenda_activity,
                include: [{ model: model.activity,
                    include: [ {model:  model.task_list, attributes: ['id', 'title']},
                        { model: model.role, attributes: ['id', 'name']},
                        { model: model.user, as: 'response_actor'},
                        { model: model.user, as: 'backup_actor', attributes: ['id', 'email'] },
                        { model: model.user, as: 'accountable_actor', attributes: ['id', 'email']},
                    ]
                },
                { model: model.role, attributes: ['id', 'name']},
                { model: model.user, as: 'response_actor'},
                { model: model.user, as: 'backup_actor', attributes: ['id', 'email'] },
                { model: model.user, as: 'accountable_actor', attributes: ['id', 'email']}
                ]
            },{model: model.all_category}]
        }]
    })
    .then(function(actionPlan) {
        res.send(actionPlan);
    });
});


router.get('/get-all-category-agenda-points', function(req, res, next) {
    model.action_plan.findOne({ where: { id: req.query.id },
        attributes: ['id'],
        include: [
           {model: model.agendaPoint,attributes: ['id']}
        ]
    }).then(function (plan) {
        var points = plan.agendaPoints.map(function (value, label) {
            return value.id;
        });
        console.log('-------------------',points);
        model.all_category.findAll({ where: { userAccountId: req.user.userAccountId,isDeleted:false }, 
            include: [
                {model : model.agendaPoint,
                    where : {id: { $in: points }},
                    include:[{
                        model: model.agenda_activity,
                        include: [{ model: model.activity,
                            include: [ {model:  model.task_list, attributes: ['id', 'title']},
                                { model: model.role, attributes: ['id', 'name']},
                                { model: model.user, as: 'response_actor'},
                                { model: model.user, as: 'backup_actor', attributes: ['id', 'email'] },
                                { model: model.user, as: 'accountable_actor', attributes: ['id', 'email']},
                            ]
                        },
                        { model: model.role, attributes: ['id', 'name']},
                        { model: model.user, as: 'response_actor'},
                        { model: model.user, as: 'backup_actor', attributes: ['id', 'email'] },
                        { model: model.user, as: 'accountable_actor', attributes: ['id', 'email']}
                        ]
                    }],
                    required : false
                }
            ],
            order: [
                ['name', 'ASC']
            ]
        })
        .then(function (response) {
            res.send(response);
        });
    });

});

router.post('/copy-action-plan', function(req, res, next) {
    var record = req.body;
    model.action_plan.findOne({where: {id: req.body.data},
        include:[
            {model : model.agendaPoint},
            {model: model.section},
            {model: model.plan_activities}
        ]
    })
    .then(function(actionPlan) {
        var data = {};
        data.plandate = actionPlan.plandate;
        data.isComplete = false;
        data.kind = actionPlan.kind;
        data.type = actionPlan.type;
        data.description = actionPlan.description;
        data.scenarioId = actionPlan.scenarioId;
        data.categoryId = actionPlan.categoryId;
        data.name = req.body.toData;
        data.userAccountId = req.user.userAccountId;
        model.action_plan.create(data).then(function (response) {
            model.action_plan.findOne({where: {id: response.id}})
            .then(function(act) {
                if(actionPlan.kind == 'agendaPoints'){
                    act.addAgendaPoints(actionPlan.agendaPoints).then(function(){
                        model.action_plan.findOne({where: {id: response.id},
                            order: [['name', 'ASC']],
                            include : [{model : model.agendaPoint,
                                include : [{
                                    model : model.agenda_activity
                                }]
                            }]
                        })
                        .then(function(actionPlanAgendaPoint) {
                            res.send(actionPlanAgendaPoint);
                        });
                    });
                }else{
                    var Promises = [];
                    _.each(actionPlan.sections, function (rol,ind){
                        var toData = {};
                        toData.name = rol.name;
                        toData.actionPlanId = response.id;
                        toData.default = rol.default;
                        toData.index = rol.index;
                        Promises.push(model.section.create(toData));
                    });
                    Q.allSettled(Promises).done(function (responses) {
                        sectionList = _.map(responses, function (t,ind) { return {
                            old: actionPlan.sections[ind].id,
                            new: t.value.id
                        }});
                        _.each(actionPlan.plan_activities, function (fromPlanActivities,ind){
                            var toData = {};
                            if(fromPlanActivities.sectionId){
                                _.each(sectionList, function (findSection){
                                    if(findSection.old == fromPlanActivities.sectionId){
                                        toData.sectionId = findSection.new;
                                    }
                                });
                            }
                            toData.default = fromPlanActivities.default;
                            toData.index = fromPlanActivities.index;
                            toData.tindex = fromPlanActivities.tindex;
                            toData.activityId = fromPlanActivities.activityId;
                            toData.actionPlanId = response.id;
                            model.plan_activities.create(toData);
                        });
                    });
                    model.action_plan.findOne({where: {id: response.id}}).then(function(actionPlanAgendaPoint) {
                        res.send(actionPlanAgendaPoint);
                    });
                }
            });
        });
    });
});

router.post('/save-agenda-point-list', function(req, res, next) {
    var record = req.body;
    model.action_plan.findOne({where: {id: req.body.data},
        order: [
            ['name', 'ASC']
        ]
    })
    .then(function(actionPlan) {
        actionPlan.addAgendaPoints(record.selected).then(function(){
            model.action_plan.findOne({where: {id: req.body.data},
                order: [['name', 'ASC']],
                include : [{model : model.agendaPoint,
                    include : [{
                        model : model.agenda_activity
                    }]
                }]
            })
            .then(function(actionPlanAgendaPoint) {
                // var data = {
                //     data: actionPlanAgendaPoint,
                //     action: 'new'
                // }
                // req.app.get('io').emit('agenda_point:' + ,data)
                res.send(actionPlanAgendaPoint);
            });
        });
    });
});


router.post('/set-agenda-point-list', function(req, res, next) {
    var record = req.body;
    model.action_plan.findOne({where: {id: req.body.data},
        order: [
            ['name', 'ASC']
        ]
    })
    .then(function(actionPlan) {
        actionPlan.setAgendaPoints(record.selected).then(function(){
            model.action_plan.findOne({where: {id: req.body.data},
                order: [['name', 'ASC']],
                include : [{model : model.agendaPoint,
                    include : [{
                        model : model.agenda_activity,
                        // where : {actionPlanId : req.body.data}
                    }]
                }]

            })
            .then(function(actionPlanAgendaPoint) {
                // var data = {
                //     data: actionPlanAgendaPoint,
                //     action: 'new'
                // }
                // req.app.get('io').emit('agenda_point:' + ,data)
                res.send(actionPlanAgendaPoint);
            });
        });
    });
});



router.get('/all', function (req, res, next) {
    model.action_plan.findAll({ where: { userAccountId: req.user.userAccountId,isDeleted:false },
        attributes: {
            include: [
                [Sequelize.fn("COUNT", Sequelize.col("plan_activities.id")), "actCount"],
                [Sequelize.fn("COUNT", Sequelize.col("agendaPoints.agenda_activities.id")), "agendaActCount"]
            ],
        },
        include: [
            {model: model.category},
            {model: model.scenario, attributes: ['name']},
            {model: model.plan_activities, attributes: []},
            {model: model.agendaPoint, attributes: [],include: [{model: model.agenda_activity, attributes: []}]}
        ],
        order: [
            ['name', 'ASC']
        ],
        group: ['action_plan.id', 'category.id', 'scenario.id','agendaPoints.action_plan_agenda_lists.id']
    })
    .then(function (response) {
        res.send(response);
    });
});

router.get('/:id/sections', function (req, res, next) {
    model.section.findAll({
        where: { actionPlanId: req.params.id,isDeleted:false },
        include: [{ model: model.plan_activities,
            attributes: ['id', 'index', 'tindex', 'default'],
            order: [
                ['tindex', 'ASC']
            ],
            include: [{ model: model.activity,
                include: [
                    {
                        model:  model.task_list,
                        include: [
                            {
                                model: model.library_reference
                                // attributes: ['url','mimetype']
                            }
                        ]
                    }
                ]
            }]
        }]
    }).then(function (response) {
        response.forEach(function(s){
            var section = s.dataValues;
            var activities = [];
            section.plan_activities.forEach(function(planActivity){
                if(planActivity.activity)
                activities.push(planActivity.activity.id)
            });
            // delete section.plan_activities;
            section.activities = activities;
        });
        res.send(response);
    });
});

router.get('/activities', function (req, res, next) {
    model.action_plan.findOne({
        where: { id: req.query.actionPlanId },
        attributes: ['id', 'name'],
        include: [{ model: model.plan_activities,
            attributes: ['id', 'index', 'tindex', 'default'],
            include: [{ model: model.activity,
                attributes: ['id', 'type', 'description', 'responsibility_level', 'response_time', 'completion_time'],
                include: [ {model:  model.task_list, attributes: ['id', 'title']},
                    { model: model.organization},
                    { model: model.role, attributes: ['id', 'name']},
                    { model: model.department},
                    { model: model.user, as: 'response_actor', attributes: ['id', 'firstName', 'lastName', 'email', 'available'] },
                    { model: model.user, as: 'backup_actor', attributes: ['id', 'email'] },
                    { model: model.user, as: 'accountable_actor', attributes: ['id', 'email']},
                    { model: model.outcome, attributes: ['id', 'name', 'outcome_activity_id']
                    }]
            }]
        }]
    }).then(function (actionPlan) {
        var activities = [];
        actionPlan.plan_activities.forEach(function(plan_activity) {
            activities.push({
                id: plan_activity.activity.id,
                taskListId: plan_activity.activity.task_list ? plan_activity.activity.task_list.id : null,
                title: plan_activity.activity.task_list ? plan_activity.activity.task_list.title : 'N/A',
                type: plan_activity.activity.type,
                description: plan_activity.activity.description,
                responsibility_level: plan_activity.activity.responsibility_level,
                response_time: plan_activity.activity.response_time,
                completion_time: plan_activity.activity.completion_time,
                response_actor_email: plan_activity.activity.response_actor ? plan_activity.activity.response_actor.email : null,
                responseActorId: plan_activity.activity.response_actor ? plan_activity.activity.response_actor.id : null,
                response_actor_available: plan_activity.activity.response_actor ? plan_activity.activity.response_actor.available : null,
                response_actor_name: plan_activity.activity.response_actor ? plan_activity.activity.response_actor.firstName + ' ' + plan_activity.activity.response_actor.lastName : null,
                backup_actor_email: plan_activity.activity.backup_actor ? plan_activity.activity.backup_actor.email : null,
                backupActorId: plan_activity.activity.backup_actor ? plan_activity.activity.backup_actor.id : null,
                accountable_actor_email: plan_activity.activity.accountable_actor ? plan_activity.activity.accountable_actor.email : null,
                accountableActorId: plan_activity.activity.accountable_actor ? plan_activity.activity.accountable_actor.id : null,
                role: plan_activity.activity.role ? plan_activity.activity.role.name : null,
                roleId: plan_activity.activity.role ? plan_activity.activity.role.id : null,
                organization: plan_activity.activity.organization ? plan_activity.activity.organization.name : null,
                organizationId: plan_activity.activity.organization ? plan_activity.activity.organization.id : null,
                department: plan_activity.activity.department ? plan_activity.activity.department.name : null,
                departmentId: plan_activity.activity.department ? plan_activity.activity.department.id : null,
                outcomes: plan_activity.activity.outcomes,
                outcomes_count: plan_activity.activity.outcomes.length,
                planActivityId: plan_activity.id,
                index: plan_activity.index,
                tindex: plan_activity.tindex,
                default: plan_activity.default
            })
        });
        res.send(activities);

    });
});



router.get('/incident-plan', function (req, res, next) {
    model.action_plan.findOne({
        where: { id: req.query.actionPlanId },
        attributes: ['id'],
        include: [{
            model: model.incident_plan,
            where: { incidentId: req.query.incidentId },
            attributes: ['id', 'plan_activated', 'activity_status']
        }]
    }).then(function (actionPlan) {
        var activities = [];
        _.each(actionPlan.incident_plans[0].activity_status, function (status) {
            activities.push(model.activity.findOne({
                where: { id: status.activityId },
                attributes: ['id', 'description', 'response_time', 'completion_time', 'type', 'responsibility_level'],
                include: [
                    { model: model.task_list, attributes: ['title'] },
                    { model: model.organization},
                    { model: model.department},
                    { model: model.role},
                    {
                        model: model.user,
                        as: 'response_actor',
                        attributes: ['id', 'firstName', 'lastName', 'title', 'officePhone', 'mobilePhone', 'email', 'available'],
                        include: [{ model: model.department, attributes: ['name'] }]
                    }
                ]
            }));
        });

        Q.allSettled(activities).then(function (res) {
            var statuses = _.map(res, function (activity, index) {
                return {
                    id: activity.value.id,
                    title: activity.value.task_list.title,
                    description: activity.value.description,
                    response_time: activity.value.response_time,
                    completion_time: activity.value.completion_time,
                    type: activity.value.type,
                    status: actionPlan.incident_plans[0].activity_status[index].task_status,
                    status_timestamp: actionPlan.incident_plans[0].activity_status[index].activity_status_timestamp,
                    activated: actionPlan.incident_plans[0].activity_status[index].activated,
                    activity_timestamp: actionPlan.incident_plans[0].activity_status[index].activity_timestamp,
                    responsibility_level: activity.value.responsibility_level,
                    responseActorTitle: activity.value.response_actor ? activity.value.response_actor.title : 'N/A',
                    responseActorFirstName: activity.value.response_actor ? activity.value.response_actor.firstName : '',
                    responseActorLastName: activity.value.response_actor ? activity.value.response_actor.lastName : 'N/A',
                    responseActorEmail: activity.value.response_actor ? activity.value.response_actor.email : 'N/A',
                    responseActorOfficeNum: activity.value.response_actor ? activity.value.response_actor.officePhone : 'N/A',
                    responseActorMobileNum: activity.value.response_actor ? activity.value.response_actor.mobilePhone : 'N/A',
                    responseActorDept: activity.value.response_actor ? activity.value.response_actor.department : 'N/A',
                    responseActorId: activity.value.response_actor ?  activity.value.response_actor.id : null,
                    responseActorAvailable: activity.value.response_actor ? activity.value.response_actor.available : false,
                    role: activity.value.role ? activity.value.role.name : 'N/A',
                    department: activity.value.department ? activity.value.department.name : 'N/A',
                    organization: activity.value.organization ? activity.value.organization.name : 'N/A'
                }
            });
            actionPlan.activities = statuses;
        });

        Q.allSettled(activities).done(function (results) {
            var data = {}
            data.activities = actionPlan.activities;
            data.action_plan = actionPlan;
            res.send(data);
        });
    });
});


router.post('/assign-activity', function (req, res, next) {
    var record = req.body.data;
    model.action_plan.findOne({
        where: { id: record.actionPlanId }
    }).then(function (actionPlan) {
        model.activity.findOne({
            where: { id: record.activitySelected },
            include: [
                { model: model.task_list, attributes: ['title','id'] },
                { model: model.user, as: 'response_actor', attributes: ['email'] },
                { model: model.user, as: 'backup_actor', attributes: ['email'] },
                { model: model.user, as: 'accountable_actor', attributes: ['email'] }
            ]
        }).then(function (activity) {
            actionPlan.addActivity(activity)
                .then(function (planActivity) {
                    model.plan_activities.findOne({ where: { actionPlanId: record.actionPlanId, activityId: record.activitySelected } })
                        .then(function (planActivity) {
                            model.plan_activities.update({ tindex: record.nextIndex, index: record.nextIndex, sectionId: record.sectionId }, { where: { id: planActivity.id } })
                                .then(function (response) {
                                    // activity.planActivity = planActivity;
                                    var actRes = {}
                                    actRes.activity = activity;
                                    actRes.planActivity = planActivity;
                                    res.send(actRes);
                                });
                        });
                });
        });
    });
});

router.post('/assign-activity-section', function (req, res, next) {
    var record = req.body.data;
    model.action_plan.findOne({
        where: { id: record.actionPlanId }
    }).then(function (actionPlan) {
        model.activity.findOne({
            where: { id: record.activitySelected },
            include: [
                { model: model.task_list, attributes: ['title'] },
                { model: model.user, as: 'response_actor', attributes: ['email'] },
                { model: model.user, as: 'backup_actor', attributes: ['email'] },
                { model: model.user, as: 'accountable_actor', attributes: ['email'] }
            ]
        }).then(function (activity) {
            actionPlan.addActivity(activity)
                .then(function (planActivity) {
                    model.plan_activities.findOne({ where: { actionPlanId: record.actionPlanId, activityId: record.activitySelected } })
                        .then(function (planActivity) {
                            model.plan_activities.update({ tindex: record.nextIndex, sectionId: record.sectionId }, { where: { id: planActivity.id } })
                                .then(function (response) {
                                    res.send(activity);
                                });
                        });
                });
        });
    });
});


router.post('/save', function (req, res, next) {
    var record = req.body.data;
    record.userId = req.user.id;
    record.userAccountId = req.user.userAccountId;
    model.action_plan.create(record).then(function (response) {
        model.action_plan.findOne({
            where: { id: response.id },
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("plan_activities.id")), "actCount"]]
            },
            include: [
                {model: model.category},
                {model: model.scenario, attributes: ['name']},
                {model: model.plan_activities, attributes: []}
            ],
            order: [
                ['name', 'ASC']
            ],
            group: ['action_plan.id', 'category.id', 'scenario.id']
        }).then(function (resp) {
            var data = {
                data: resp,
                action: 'new'
            }
            req.app.get('io').emit('action_plan:' + response.userAccountId,data)
            res.send(resp);
        });
    });
});

// router.post('/remove', function(req, res, next) {
//     model.incident_plan.findOne({where: {actionPlanId: req.body.data.id } }).then(function(response){
//         if(response){
//             res.send({success:false, msg:response.toString()});
//         }else{plan_activities
//             model.plan_activities.destroy({where: {actionPlanId: req.body.data.id}}).then(function(response){
//                 model.action_plan.destroy({where: {id: req.body.data.id}}).then(function(response) {
//                     res.send({success:true, msg:response.toString()});
//                 },function(response){
//                     res.send({success:false, msg:response.toString()});
//                 });
//             },function(response){
//                 res.send({success:false, msg:response.toString()});
//             });
//         }
//     });
// });
router.delete('/delete/:id', function(req, res, next) {
    model.incident_plan.findOne({where: {actionPlanId: req.params.id } }).then(function(response){
        if(response){
            res.send({success:false, msg:response.toString()});
        }else{
            model.action_plan.destroy({where: {id: req.params.id}}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            },function(response){
                model.action_plan.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
                    res.send({success:true, msg:response.toString()});
                });
            });
        }
    });
});
router.post('/delete-assigned-activity', function(req, res, next) {
    model.plan_activities.destroy({
        where: {
            $and: {
                actionPlanId:{
                    $eq: req.body.data.actionPlanId,
                },
                activityId: {
                    $eq: req.body.data.activityId
                },
                sectionId: {
                    $eq: req.body.data.sectionId
                }
            }
        }
    }).then(function(resp) {
        res.send({success:true, msg:resp.toString()});
    },function(response){
        model.plan_activities.update({isDeleted:true},{
            where: {
                $and: {
                    actionPlanId:{
                        $eq: req.body.data.actionPlanId,
                    },
                    activityId: {
                        $eq: req.body.data.activityId
                    },
                    sectionId: {
                        $eq: req.body.data.sectionId
                    }
                }
            }
        }).then(function(resp) {
            res.send({success:true, msg:resp.toString()});
        },function(response){
            res.send({success:false, msg:response.toString()});
        })
    })
});
router.post('/update', function (req, res, next) {
    model.action_plan.update(req.body.data, { where: { id: req.body.data.id } }).then(function (response) {
        res.send(response);
    });
});

router.post('/dash-board-sections', function (req, res, next) {
    console.log("===========================")
    console.log(req.body.data);
    model.action_plan.findOne({ where: { id: req.body.data.actionPlanId },
        attributes: ['id'],
        include: [{ model: model.incident_activity,
            attributes: ['id', 'type', 'name', 'description', 'responsibility_level',
                'activity_id', 'default', 'copy', 'activated', 'status', 'index',
                'activatedAt', 'statusAt', 'createdAt', 'tindex'],
            where: {incident_id : req.body.data.incidentId},
            required: false,
            include: [{ model: model.organization, attributes: ['id', 'name'] },
                { model: model.role, attributes: ['id', 'name'] },
                { model: model.department, attributes: ['id', 'name'] },
                { model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'available',
                        'role', 'title', 'officePhone', 'mobilePhone'],
                    include: [{ model: model.department, attributes: ['id', 'name'] }]
                }]
        },
        {  model: model.section,
            attributes: ['id', 'name', 'index'],
            order: ['name', 'ASC'],
            include: [{ model: model.incident_activity,
                attributes: ['id', 'type', 'name', 'description', 'responsibility_level',
                    'activity_id', 'default', 'copy', 'activated', 'status', 'index',
                    'activatedAt', 'statusAt', 'createdAt', 'tindex'],
                where: {incident_id : req.body.data.incidentId},
                required : false,
                include: [{ model: model.organization, attributes: ['id', 'name'] },
                    { model: model.role, attributes: ['id', 'name'] },
                    { model: model.department, attributes: ['id', 'name'] },
                    { model: model.user, as: 'response_actor', foreignKey: 'responseActorId',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'available',
                            'role', 'title', 'officePhone', 'mobilePhone'],
                        include: [{ model: model.department, attributes: ['id', 'name'] }]
                    }]
            }]
        }]
    }).then(function (response) {

        res.send(response);
    });
});
router.get('/dash-board-activities/:id', function (req, res, next) {
    model.incident_plan.findOne({ where: { id: req.params.id },
        attributes: ['id'],
        include: [
           {model: model.action_plan},
           {model : model.incident_agenda_point}
        ]
    }).then(function (response) {
        res.send(response);
    });
});

router.get('/dash-board-agenda-activities/:id', function (req, res, next) {
    model.incident_agenda_point.findOne({ where: { id: req.params.id },
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
module.exports = router;
