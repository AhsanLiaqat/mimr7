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

router.post('/update', function (req, res, next) {
    var record = req.body;
    if(record.activated == false){
        delete record.activatedAt;
    }
    model.incident_agenda_activity.update(record.activity, { where: { id: record.activity.id } })
        .then(function (result) {

            model.incident_agenda_activity.findOne({
                where: { id: record.activity.id },
                attributes: ['id', 'type', 'name', 'description', 'responsibility_level', 'default', 'incident_plan_id',
                    'incidentId', 'copy', 'activated', 'status', 'index', 'activatedAt', 'statusAt', 'createdAt', 'tindex'],
                include: [{ model: model.organization, attributes: ['id', 'name'] },
                    { model: model.role, attributes: ['id', 'name'] },
                    { model: model.department, attributes: ['id', 'name'] },
                    { model: model.user, as: 'response_actor', foreignKey: 'responseActorId',

                        attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone'],
                        include: [{ model: model.department, attributes: ['id', 'name'] }]
                    }]
            }).then(function (data) {
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

router.get('/get', function (req, res, next) {
    model.incident_agenda_activity.findOne({
        where: { id: req.query.id,isDeleted: false },
        include: [{ model: model.organization, attributes: ['id', 'name'] },
            { model: model.role, attributes: ['id', 'name'] },
            { model: model.department, attributes: ['id', 'name'] }]
    }).then(function (incidentAgendaActivity) {
        res.send(incidentAgendaActivity);
    })
});

function setActivitySocketActionPlanDashboard(req, activityId){
    model.incident_agenda_activity.findOne({
        where: { id: activityId },
        attributes: ['id', 'type', 'name', 'description', 'responsibility_level', 'default', 'incident_plan_id',
            'incident_id', 'copy', 'activated', 'status', 'index', 'activatedAt', 'statusAt', 'createdAt', 'tindex'],
        include: [{ model: model.organization, attributes: ['id', 'name'] },
            { model: model.role, attributes: ['id', 'name'] },
            { model: model.department, attributes: ['id', 'name'] },
            { model: model.user, as: 'response_actor', foreignKey: 'responseActorId',

                attributes: ['id', 'firstName', 'lastName', 'email', 'available', 'role', 'title', 'officePhone', 'mobilePhone'],
                include: [{ model: model.department, attributes: ['id', 'name'] }]
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
    model.incident_agenda_activity.update({responseActorId: record.responseActorId},
        { where: { id: req.params.id } })
    .then(function(data){
        setActivitySocketActionPlanDashboard(req,req.params.id);
        res.send(200);
    });
});

router.post('/save', function(req, res, next) {
    var data = req.body.data;
    model.incident_agenda_activity.create(data).then(function(message) {
        res.send(message);
    });
});

router.delete('/delete/:id', function (req, res, next) {
    var io = req.app.get('io');
    model.incident_agenda_activity.findOne({
        where: {
            id: req.params.id
        },
        attributes:['incident_plan_id','incidentId']
    }).then(function(response){
        if(response){
            response = response.toJSON();
            var data = {
                id: req.params.id,
                incidentPlanId:response.incident_plan_id,
                incidentId: response.incidentId,
            }
            console.log("Response---->",data);
        }
        model.incident_agenda_activity.destroy({
            where: {id: req.params.id}
        }).then(function(resp){
            var response = {
                data: data,
                action: 'delete'
            }
            // io.emit('incident_plan_activity:' + data.incidentPlanId,response)
            res.send({success:true, msg:resp.toString()});
        },function(response){
            model.incident_agenda_activity.update({isDeleted:true},{
                where: {id: req.params.id}
            }).then(function(resp){
                var response = {
                    data: data,
                    action: 'delete'
                }
                // io.emit('incident_plan_activity:' + data.incidentPlanId,response)
                res.send({success:true, msg:resp.toString()});
            })
        })
    })
});

module.exports = router;