var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');

router.post('/update', function(req, res, next) {
    var record = req.body;
    var activitieso = [];
    var destroyActivity = [];
    model.section.update(record, {where: { id : record.id }})
        .then(function(response) {
            model.section.findOne({
                where: {id: record.id},
                include: [{
                    model: model.plan_activities, attributes: ['id']

                }]}).then(function(sec) {
            // sec.setPlan_activities([]);
                _.each(record.activities, function (activity, index) {

                    destroyActivity.push(
                        model.plan_activities.destroy({where: {id: activity.id}}).then(function(){
                        })
                    )
                    activitieso.push(model.plan_activities.create({
                        activityId: activity.id,
                        sectionId: sec.id,
                        actionPlanId: req.body.actionPlanId,
                        index: index}));
                });

                Q.allSettled(destroyActivity).then(function (ress) {
                    // res.send(sec);
                });

                Q.allSettled(activitieso).then(function (ress) {

                    model.section.findOne({
                        where: {id: record.id},
                        include: [{
                            model: model.activity,
                            include: [{ model: model.task_list}]

                        }]}).then(function(section){
                        res.send(section);
                    });
                });
            });
        });
});

router.post('/update-for-edit', function(req, res, next) {
    var record = req.body;
    var activitieso = [];
    var destroyActivity = [];
    model.section.update(record, {where: { id : record.id }})
        .then(function(response) {
            if(record.activities) {
                _.each(record.activities, function (activity, index) {
                    model.plan_activities.findOne({
                        where: {
                            id: activity.id,
                            actionPlanId: record.actionPlanId
                        }}).then(function(pa){
                        if (pa != null){
                            activitieso.push(model.plan_activities.update({sectionId: record.id,tindex: index}, {where: {id: pa.id}}));
                        }else{
                            activitieso.push(
                                model.plan_activities.create({
                                    activityId: activity.id,
                                    sectionId: record.id,
                                    actionPlanId: record.actionPlanId,
                                    index: index})
                            );
                        }
                    });
                });
                Q.allSettled(activitieso).then(function (ress) {
                    model.section.findOne({
                        where: {id: record.id},
                        include: [{
                            model: model.plan_activities,
                            include: [{ model: model.activity,
                                include: [{ model: model.task_list}]}]
                        }]}).then(function(section){
                        res.send(section);
                    });
                });
            }else{
                // console.log('=-=-=--=-=-=-=-=-=-=Else');
                model.section.findOne({
                    where: {id: record.id},
                    include: [{
                        model: model.plan_activities,
                        include: [{ model: model.activity,
                            include: [{ model: model.task_list}]}]
                    }]
                }).then(function(section){
                    res.send(section);
                });
            }
        });
    });

router.post('/create', function(req, res, next) {
    var record = req.body;
    console.log(record);
    var activitieso = [];
    model.section.create(record).then(function(response) {

        _.each(req.body.activities, function (activity, index) {
            model.plan_activities.findOne({
                where: {
                    id: activity.id,
                    actionPlanId: record.actionPlanId
                }}).then(function(pa){
                if (pa != null){
                    activitieso.push(model.plan_activities.update({sectionId: response.id,tindex: index}, {where: {id: pa.id}}));
                }else{
                    activitieso.push(
                        model.plan_activities.create({
                            activityId: activity.id,
                            sectionId: response.id,
                            actionPlanId: record.actionPlanId,
                            index: index,
                            tindex: index
                        })
                    );
                }
            });
        });

        Q.allSettled(activitieso).then(function (ress) {
            model.section.findOne({
                where: {id: response.id},
                include: [{
                    model: model.plan_activities,
                    include: [{ model: model.activity,
                        include: [{ model: model.task_list}]}]

                }]}).then(function(section){
                res.send(section);
            });
        });

    }).catch(function(err) {
        console.log(err, req.body);
    });

});

router.post('/create1', function(req, res, next) {
    var record = req.body;
    console.log(record);
    var activitieso = [];
    model.section.create(record).then(function(response) {

        _.each(req.body.activities, function (activity, index) {

            activitieso.push(
                model.plan_activities.create({
                    activityId: activity.id,
                    sectionId: response.id,
                    actionPlanId: record.actionPlanId,
                    index: index})
            );

        });

        Q.allSettled(activitieso).then(function (ress) {
            model.section.findOne({
                where: {id: response.id},
                include: [{
                    model: model.activity,
                    include: [{ model: model.task_list}]

                }]}).then(function(section){
                res.send(section);
            });
        });

    }).catch(function(err) {
        console.log(err, req.body);
    });

});

router.post('/create-default', function(req, res, next) {
    var record = req.body;
    model.section.findOne({where: {default: true, actionPlanId: req.body.actionPlanId}}).then(function(sec){
        if(sec){
            res.send(sec);
        }else{
            model.section.create({default: true,name: 'Activities', index: 0, actionPlanId: req.body.actionPlanId}).then(function(response) {
                res.send(response);
            });
        }
    });

});

router.post('/update-index', function(req, res, next) {
    var record = req.body;
    model.section.update({index: record.index}, {where: {id: record.id}}).then(function(response) {
        res.send(response);
    });
});

router.post('/move-to-default-section', function(req, res, next) {
    var record = req.body.data;
    model.plan_activities.update({sectionId: record.defaultId}, {where: {id: record.activityId, actionPlanId: record.actionPlanId}}).then(function(response) {
        res.send(response);
    });
});

router.delete('/delete/:id', function(req, res, next) {
    var destroyActivity = [];
    model.section.findOne({
        where: {id: req.params.id},
        include: [{
            model: model.incident_activity,
            attributes: ['id']
        }
        ,{
            model: model.activity,
            include: [{
                model: model.task_list
            }]
        }]
    }).then(function(incidentPlan){
        var isError = false;
        if (incidentPlan){
            destroyActivity.push(_.each(incidentPlan.activities, function (activity, index) {
                model.plan_activities.destroy({where: {id: activity.id}}).then(function(response){

                },function(response){
                    isError = true;
                });
            }));

            destroyActivity.push(_.each(incidentPlan.incident_activities, function(activity){
                model.incident_activity.destroy({where: {id: activity.id}}).then(function(response){

                },function(response){
                    isError = true;
                });
            }));
            Q.allSettled(destroyActivity).then(function(){
                if(!isError){
                    incidentPlan.destroy().then(function(response){
                        var data = {
                            data: incidentPlan.id,
                            action: 'delete'
                        }
                        req.app.get('io').emit('section_action_plan:' + incidentPlan.actionPlanId,data)
                        res.send({success:true, msg:response.toString()});
                    },function(response){
                        incidentPlan.update({isDeleted:true}).then(function(response){
                            res.send({success:true, msg:response.toString()});
                        });
                    });
                }else {
                    res.send({success:false, msg:response.toString()});
                }
            })
        }
    }).catch(function (err) {
        res.send(err);
    });
});

module.exports = router;
