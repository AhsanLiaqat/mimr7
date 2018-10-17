var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');

router.get('/get', function (req, res, next) {
    model.agenda_activity.findOne({
        where: { id: req.query.id,isDeleted: false },
        include: [{ model: model.organization, attributes: ['id', 'name'] },
            { model: model.role, attributes: ['id', 'name'] },
            { model: model.department, attributes: ['id', 'name'] },
            { model: model.activity }]
    }).then(function (incidentAgendaActivity) {
        res.send(incidentAgendaActivity);
    })
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    model.agenda_activity.create(record).then(function(activity) {
        model.agenda_activity.findOne({where: {id: activity.id},
            include:[{
                model: model.activity,
                include:[{
                    model: model.task_list
                }]
            }]
        })
        .then(function(agendaActivity) {
            res.send(agendaActivity);
        });
    });
});
router.post('/update', function(req, res, next) {
    var record = req.body;
    console.log('--------------------',record);
    model.agenda_activity.update(record, {where: { id : record.id }}).then(function (list) {
        model.agenda_activity.findOne({where: {id: record.id},
            include:[{
                model: model.activity,
                include:[{
                    model: model.task_list
                }]
            }]
        })
        .then(function(agenda_activity) {
            res.send(agenda_activity);
        });
    });
});
router.put('/update-actor/:id', function (req, res, next) {
    var record = req.body;
    model.agenda_activity.update({responseActorId: record.responseActorId},
        { where: { id: req.params.id } })
    .then(function(data){
        // setActivitySocketActionPlanDashboard(req,req.params.id);
        res.send(200);
    });
});

module.exports = router;