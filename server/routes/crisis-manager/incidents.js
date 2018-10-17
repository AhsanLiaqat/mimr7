var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next()

    // if they aren't redirect them to the home page
    res.redirect("/login")
}

/* GET Incidents listing except closed. */
router.get('/list', function (req, res, next) {
    model.incident.findAll({
        where: {
            userAccountId: req.query.userAccountId,
            active: ['Active', 'OnHold'],
            isDeleted: false
        },
        order: [
            ['name', 'ASC']
        ],
        include: [{
            model: model.category,
            required: false,
            as: 'category'
        }
            , {
            model: model.incident_plan,
            where:{selected:true,isDeleted: false},
            required: false,
            include: [{model: model.action_plan}]
        }]

    }).then(function (response) {
        res.send(response);
    }, function (err) {
        console.log(err);
        res.send()
    });
});

/* GET incidents listing without any restriction on status. */
router.get('/unrestricted-list', function (req, res, next) {
    model.incident.findAll({
        where: {
            userAccountId: req.query.userAccountId,
            isDeleted: false
        },
        order: [
            ['name', 'ASC']
        ],
        include: [{
            model: model.category,
            required: false,
            as: 'category'
        }, {
            model: model.incident_plan,
            required: false,
            where: {isDeleted: false},
            include: [{model: model.action_plan}]
        }]
    }).then(function (incidents) {
        model.formType.findOne({
            where: {
                name: 'Incident Questionnaire'
            },
            attributes: ['name', 'multiple'],
            include: [{
                required: false,
                model: model.dynamic_form,
                where: {
                    userAccountId: req.user.userAccountId
                }
            }]
        }).then(function(respxp) {
            var promises = [];
            _.each(incidents, function (inc) {
                promises.push(model.submission.findAll({
                    where: {
                        tableId: inc.id,
                        tableName: 'Incident'
                        // dynamicFormId: $scope.questionnaire.id
                    },
                    order: [['createdAt', 'ASC']]
                }));
            });
            Q.allSettled(promises).then(function (respp) {
                _.each(respp, function (promise,index) {
                    var data = (promise.value.length > 0)? promise.value : []
                    incidents[index].dataValues.form_data = data;
                    incidents[index].dataValues.form_exists = (respxp.dataValues.dynamic_forms.length > 0)? true : false;
                });
                res.send(incidents);
            });
        });
    }, function (err) {
        console.log(err);
        res.send(err)
    });
});

router.get('/archive-list', function (req, res, next) {
    model.incident.findAll({
        where: {
            userAccountId: req.query.userAccountId,
            active: 'Closed',
            isDeleted: false
        }, include: [{
            model: model.category,
            required: false,
            as: 'category'
        },
        {
            model: model.incident_plan,
            where: {isDeleted: false},
            include: [{model: model.action_plan}]
        }]
    }).then(function (response) {
        res.send(response);
    }, function (err) {
        console.log(err);
        res.send()
    });
});

router.post("/save", function (req, res, next) {
    var data = req.body;
    model.incident.create({
        name: data.name,
        categoryId: data.categoryId,
        reporterId: req.user.id,
        incidentsTeamId: data.incidentsTeamId,
        userAccountId: req.user.userAccountId
    }).then(function (incident) {
        var locP = [];
        model.action_list.create({
            name: 'Action List',
            index: 0,
            userAccountId: req.user.userAccountId,
            incidentId: incident.dataValues.id
        }).then(function (list) {
        });
        _.each(data.locations, function (loc) {
            locP.push(model.place.findOrCreate({
                where: { id: loc.id }, defaults: {
                    location: loc,
                    address: loc.formatted_address
                }
            }));
        });
        Q.allSettled(locP).then(function (res) {
            var locs = _.map(res, function (loc) { return loc.value[0] });
            incident.addLocations(locs);
        });
        res.send(incident);
    });
});

router.get("/all", function (req, res, next) {
    model.incident.findAll({
        where: {
            active: 'Active',
            userAccountId: req.query.userAccountId,
            isDeleted: false
        },
        order: [
            ['name', 'ASC']
        ], include: [{
            model: model.place,
            required: false,
            as: 'locations'
        }, {
            model: model.incident_plan,
            where: {isDeleted: false},
            required: false,
            attributes: ['id', 'plan_activated', 'actionPlanId', 'selected'],
            include: [{ model: model.action_plan,
                attributes: ['id', 'name', 'description', 'status', 'type', 'plandate', 'categoryId','kind']},
            {model: model.incident_activity, attributes: ['id', 'status']},
            {model: model.incident_agenda_activity},
            {model: model.incident_agenda_point}
            ]
        }, {
            model: model.checkList,
            as: 'checkLists',
            attributes: ['id', 'name'],
            through: {attributes: []},
            include: [{ model: model.all_category,
                attributes: ['id', 'name']}]
        }]
    }).then(function (response) {
        var data = response.map(function (incident) {
            incident = incident.toJSON();
            var locs = incident.locations.map(function (loc) {
                return {
                    id: loc.id,
                    address: loc.location.formatted_address,
                    geometry: loc.location.geometry.location
                }
            });
            incident.locations = locs;
            return incident;
        });
        res.send(data);
    }, function (err) {
        console.log(err);
        res.send()
    });
});

router.get('/get', function (req, res, next) {
    model.incident.findAll({
        where: { id: req.query.id, isDeleted: false },
        include: [{ model: model.place, required: false, as: 'locations' },
            { model: model.incident_plan,where: {isDeleted: false},required: false, attributes: ['id', 'actionPlanId', 'selected']
            }]
    }).then(function (response) {
        var data = response.map(function (incident) {
            incident = incident.toJSON();
            var locs = incident.locations.map(function (loc) {
                return loc.location
            });
            incident.locations = locs;
            return incident;
        });
        res.send(data[0]);
    }, function (err) {
        console.log(err);
        res.send();
    });
});

router.delete("/delete/:id", function(req, res, next) {
    model.incident.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.incident.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

router.post('/update', function (req, res, next) {
    
    model.incident.update(req.body.data, { where: { id: req.body.data.id } }).then(function (incident) {
        var locP = [];
        _.each(req.body.data.locations, function (loc) {
            locP.push(model.place.findOrCreate({
                where: { id: loc.id }, defaults: {
                    location: loc,
                    address: loc.formatted_address,
                    userAccountId: req.user.userAccountId
                }
            }));
        });
        Q.allSettled(locP).then(function (res) {
            var locs = _.map(res, function (loc) { return loc.value[0] });
            model.incident.findOne({
                where: { id: req.body.data.id }
            }).then(function (inci) {
                inci.setLocations(locs);
            });
        });
        res.send(incident);
    });
});

//not in use
router.post('/updatePlan', function (req, res, next) {
    var data = req.body.data;
    model.incident_plan.update({ activity_status: {}, actionPlanId: data.newPlanId },
        { where: { actionPlanId: data.originalPlanId, incidentId: data.incidentId } })
        .then(function (incident) {
            if (incident) {
                model.incident_plan.findOne({ where: { actionPlanId: data.newPlanId, incidentId: data.incidentId ,isDeleted: false} })
                    .then(function (incidentPlan) {
                        model.action_plan.findOne({
                            where: { id: incidentPlan.actionPlanId },
                            include: [{
                                model: model.activity,
                                attributes: ['id', 'type', 'outcomes'],
                                include: [{
                                    model: model.user,
                                    as: 'response_actor', foreignKey: 'responseActorId',
                                    attributes: ['id']
                                }]
                            }]
                        }).then(function (actionPlan) {
                            var activity_status = [];
                            actionPlan.activity_status = [];

                            _.each(actionPlan.activities, function (activity) {
                                activity_status.push(model.plan_activities.findOne({
                                    where: { activityId: activity.id, actionPlanId: actionPlan.id },
                                    attributes: ['id', 'index'],
                                    include: [{
                                        model: model.activity,
                                        as: 'activity', foreignKey: 'activityId',
                                        attributes: ['id', 'type', 'outcomes'],
                                        include: [{
                                            model: model.user,
                                            as: 'response_actor', foreignKey: 'responseActorId',
                                            attributes: ['id']
                                        }]
                                    }]
                                }));
                            });

                            Q.allSettled(activity_status).then(function (res) {
                                activity_status = _.map(res, function (plan_activity) {
                                    return {
                                        activityId: plan_activity.value.activity.id,
                                        responseActorId: plan_activity.value.activity.response_actor ? plan_activity.value.activity.response_actor.id : null,
                                        task_status: 'incomplete',
                                        type: plan_activity.value.activity.type,
                                        outcomes: [],
                                        index: plan_activity.value.index
                                    }
                                });
                                actionPlan.activity_status = activity_status;
                            });

                            Q.allSettled(activity_status).done(function (results) {
                                var data = {};
                                data.id = incidentPlan.id;
                                data.activity_status = actionPlan.activity_status;
                                res.send(data);
                                model.incident_plan.update({ activity_status: actionPlan.activity_status },
                                    { where: { id: incidentPlan.id } })
                                    .then(function (response) {
                                    });
                            });
                        });
                    });
            }
        });
});

module.exports = router;
