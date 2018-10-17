var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/all', function (req, res, next) {
    model.activity.findAll({
        where: { userAccountId: req.query.userAccountId,isDeleted:false },
        include: [{
            model: model.department
        }, {
            model: model.role
        }, {
            model: model.organization
        }, {
            model: model.task_list,
            attributes: ['id', 'title','for_template'],
            include: [{ model: model.tag,
                attributes: ['id', 'text'],
                require: false,
                through: {attributes: []} },
            { model: model.all_category,
                attributes: ['id', 'name', 'position']
            }]
        }, { model: model.user, as: 'response_actor', attributes: ['id', 'firstName', 'lastName', 'email'] }]
    }).then(function (response) {
        res.send(response);
    });
});

router.post('/create', function (req, res, next) {
    var record = req.body.data;

    record.activity.userAccountId = req.user.userAccountId;
    model.activity.create(record.activity).then(function (activity) {
        if (activity.type === 'decision') {
            record.outcomes.forEach(function (outcome) {
                model.outcome.create({
                    name: outcome.name,
                    decision_activity_id: activity.id,
                    outcome_activity_id: outcome.outcome_activity_id
                });
            });
        }
        model.activity.findOne({
            where: { id: activity.id },
            include: [{
                    model: model.role,
                    attributes: ['id', 'name']
                }, {
                    model: model.department,
                    attributes: ['id', 'name']
                }, {
                model: model.task_list,
                attributes: ['id', 'title','for_template'],
                include: [
                    { model: model.all_category,
                        attributes: ['id', 'name']
                    }]
            }, {
                model: model.user, as: 'response_actor', attributes: ['id', 'firstName', 'lastName', 'email']
            }]
        }).then(function (response) {
            res.send(response);
        });
    });
});


router.post('/save', function (req, res, next) {
    var record = req.body.data;

    record.activity.userAccountId = req.user.userAccountId;

    model.activity.create(record.activity).then(function (activity) {
        if (activity.type === 'decision') {
            record.outcomes.forEach(function (outcome) {
                model.outcome.create({
                    name: outcome.name,
                    decision_activity_id: activity.id,
                    outcome_activity_id: outcome.outcome_activity_id
                });
            });
        }
        model.task_list.findOne({
            where: {id: record.activity.taskListId}}).then(function(task_list) {
            console.log(task_list,task_list.id);
            var dat = {categoryId: record.activity.categoryId};
            model.task_list.update(dat, {where: { id : task_list.id }})
                .then(function(references) {
                    model.activity.findOne({
                        where: { id: activity.id },
                        include: [{
                            model: model.task_list,
                            attributes: ['id', 'title','for_template']
                        }, {
                            model: model.user, as: 'response_actor', attributes: ['id', 'firstName', 'lastName', 'email']
                        }]
                    }).then(function (response) {
                        res.send(response);
                    });
                });
        });
    });
});


router.post('/save-incident-agenda-activity', function(req, res, next) {
    var record = req.body;
    console.log('---------------',record)
    var promises = [];
    model.incident_agenda_activity.destroy({where: {incidentAgendaPointId: req.body.agendaPointId,incident_plan_id: req.body.incident_plan_id}}).then(function(response) {
        _.each(record.selected, function (msg){
            var toData = {};
            toData.actionPlanId = req.body.actionPlanId;
            toData.incidentAgendaPointId = req.body.agendaPointId;
            toData.incident_plan_id = req.body.incident_plan_id;
            toData.incidentId = req.body.incidentId;
            toData.activityId = msg.activityId;
            toData.taskListId = msg.tasklistId;
            toData.name = msg.name;
            promises.push(model.incident_agenda_activity.create(toData));
        });

        Q.allSettled(promises).done(function (responses) {
            var getPromises = [];
            responses = _.map(responses, function (t,ind) { return t.value });
            _.each(responses, function (msg){
                getPromises.push(model.incident_agenda_activity.findOne({
                    where: { id: msg.id },
                    include: [{
                        model: model.department
                    },{
                        model: model.organization
                    },{
                        model: model.role
                    },{
                        model: model.user, as: 'response_actor' , foreignKey: 'responseActorId'
                    }]
                }));
            });
            Q.allSettled(getPromises).done(function (rspnses) {
                var teamList = _.map(rspnses, function (t,ind) { return t.value });
                res.send(teamList);
            });
        });
    });

});

router.get('/not-decisions', function (req, res, next) {
    model.activity.findAll({
        where: { userAccountId: req.query.userAccountId, isDeleted:false , type: { $notLike: '%decision' } },
        attributes: ['id'],
        include: [{ model: model.task_list, attributes: ['title'] }]
    }).then(function (activities) {
        res.send(activities);
    });
});

router.post('/update', function (req, res, next) {
    var record = req.body.data;
    model.activity.update(record.activity, { where: { id: record.activity.id } })
        .then(function (response) {
            if (record.activity.type === 'decision') {
                record.outcomes.forEach(function (outcome) {
                    model.outcome.upsert({
                        id: outcome.id,
                        name: outcome.name,
                        decision_activity_id: record.activity.id,
                        outcome_activity_id: outcome.outcome_activity_id
                    });
                });
            }

            model.activity.findOne({
                where: { id: record.activity.id },
                include: [{
                    model: model.task_list,
                    attributes: ['id', 'title','for_template']
                },
                {
                    model: model.department,
                    attributes: ['id', 'name']
                }, {
                    model: model.role,
                    attributes: ['id', 'name']
                }, {
                    model: model.organization,
                    attributes: ['id', 'name']

                }, {
                    model: model.user, as: 'response_actor',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }]
            }).then(function (response) {
                res.send(response);
            });
        });
});

router.delete('/remove', function (req, res, next) {
    model.activity.destroy({ where: { id: req.query.id } }).then(function (response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.activity.update({isDeleted:true},{ where: { id: req.query.id } }).then(function (response) {
            res.send({success:true, msg:response.toString()});
        });
    })
});

module.exports = router;
