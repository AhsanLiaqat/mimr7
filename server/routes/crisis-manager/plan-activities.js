var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/get-activities', function (req, res, next) {
    model.plan_activities.findAll({ where: { actionPlanId: req.query.actionPlanId,isDeleted: false }})
        .then(function (response) {
            res.send(response);
        });
});

router.post('/update-index', function (req, res, next) {
    model.plan_activities.update({index: req.body.index}, { where: { actionPlanId: req.body.planId, activityId: req.body.activityId } })
        .then(function (response) {
            res.send(response);
        });
});

router.post('/update-index-section', function (req, res, next) {
    model.plan_activities.update({index: req.body.index}, { where: { sectionId: req.body.sectionId, activityId: req.body.activityId } })
        .then(function (response) {
            res.send(response);
        });
});
router.post('/update', function (req, res, next) {
    model.plan_activities.update(req.body, { where: { id: req.body.id } })
        .then(function (response) {
            res.send(response);
        });
});

router.post('/update-default', function (req, res, next) {
    model.plan_activities.update({default: req.body.defaultActivity}, { where: { actionPlanId: req.body.planId, activityId: req.body.activityId } })
        .then(function (response) {
            res.send(response);
        });
});

router.post('/add-copied-activities', function (req, res, next) {
    var record = req.body;

    model.plan_activities.findAll({ where: { actionPlanId: req.body.planId,isDeleted: false } })
        .then(function (planActivities) {
            var activities = [];
            _.each(planActivities, function (planActivity) {
                activities.push(model.plan_activities.create({
                    actionPlanId:   req.body.copiedPlanId,
                    activityId:     planActivity.activityId,
                    index:          planActivity.index,
                    default:        planActivity.default
                }));
            });

            Q.allSettled(activities).then(function (res) {
                activities = _.map(res, function (activity) {
                    return activity.value;
                });
            });

            Q.allSettled(activities).done(function (results) {
                var data = {};
                data.planActivities = activities;
                res.send(data);
            });
        });
});

router.post('/remove-activity', function (req, res, next) {
    model.plan_activities.destroy({ where: { actionPlanId: req.body.planId, activityId: req.body.activityId } })
    .then(function (response) {
        model.incident_plan.findAll({where: {actionPlanId: req.body.planId,isDeleted: false}})
        .then(function(incidentPlans) {
            incidentPlans.forEach(function(incidentPlan){
                incidentPlan.activity_status.forEach(function(activity_status, index){
                    if (activity_status.activityId === req.body.activityId){
                        incidentPlan.activity_status.splice(1, index);
                    }
                });
            });
            var activities = [];
            _.each(incidentPlans, function (incidentPlan) {
                activities.push(model.incident_plan.update(
                    {activity_status: incidentPlan.activity_status},
                    { where: { id: incidentPlan.id } })
                );
            });

            Q.allSettled(activities).then(function (res) {
                activities = _.map(res, function (activity) {
                    return activity.value;
                });
            });

            Q.allSettled(activities).done(function (results) {
                res.send({success:true, msg:response.toString()});
            });
        });
    },function(response){
        model.plan_activities.update({isDeleted:true},{ where: { actionPlanId: req.body.planId, activityId: req.body.activityId } })
        .then(function (response) {
            model.incident_plan.findAll({where: {actionPlanId: req.body.planId,isDeleted: false}})
            .then(function(incidentPlans) {
                incidentPlans.forEach(function(incidentPlan){
                    incidentPlan.activity_status.forEach(function(activity_status, index){
                        if (activity_status.activityId === req.body.activityId){
                            incidentPlan.activity_status.splice(1, index);
                        }
                    });
                });

                var activities = [];
                _.each(incidentPlans, function (incidentPlan) {
                    activities.push(model.incident_plan.update(
                        {activity_status: incidentPlan.activity_status},
                        { where: { id: incidentPlan.id } })
                    );
                });

                Q.allSettled(activities).then(function (res) {
                    activities = _.map(res, function (activity) {
                        return activity.value;
                    });
                });

                Q.allSettled(activities).done(function (results) {
                    res.send({success:true, msg:response.toString()});
                });
            });
        });
    });
});
//not in use
router.get('/get-default-status', function (req, res, next) {
    model.plan_activities.findOne({ where: { actionPlanId: req.query.actionPlanId, activityId: req.query.activityId }})
        .then(function (response) {
            res.send(response);
        });
});

module.exports = router;
