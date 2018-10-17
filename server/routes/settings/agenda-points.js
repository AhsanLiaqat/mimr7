var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');



router.get('/list', function(req, res, next) {
    model.agendaPoint.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [
            ['name', 'ASC']
        ],
        include:[
        {
            model: model.all_category,
            attributes: ['name']
        },
        {model : model.activity},
        {model : model.agenda_activity,
            include : [{ model: model.activity,
                include : [{
                    model : model.task_list
                }]
            }]
        }]
    })
    .then(function(list) {
        res.json(list);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.agendaPoint.create(record).then(function (point) {
        model.agendaPoint.findOne({where: {id: point.id},
            order: [
                ['name', 'ASC']
            ],
            include:[
            {
                model: model.all_category,
                attributes: ['name']
            },
            {model : model.agenda_activity}]
        })
        .then(function(agenda) {
            res.send(agenda);
        });
    });
});

router.post('/save-activity-list', function(req, res, next) {
    var record = req.body;
    var promises = [];
    model.agendaPoint.findOne({where: {id: req.body.data},
        include:[{model : model.agenda_activity}]
    }).then(function(point) {
        if(point.agenda_activities.length > 0){
            _.each(point.agenda_activities, function (act){
                promises.push(model.agenda_activity.destroy({where: { id : act.id }}));
            });
        }
        _.each(record.selected, function (msg){
            var toData = {};
            toData.activityId = msg.id;
            toData.name = msg.task_list.title;
            toData.description = msg.description;
            toData.responsibility_level = msg.responsibility_level;
            toData.type = msg.type;
            toData.response_time = msg.response_time;
            toData.completion_time = msg.completion_time;
            toData.organizationId = msg.organizationId;
            toData.roleId = msg.roleId;
            toData.departmentId = msg.departmentId;

            toData.responseActorId = msg.responseActorId;
            toData.backupActorId = msg.backupActorId;
            toData.accountableActorId = msg.accountableActorId;
            toData.agendaPointId = req.body.data;

            promises.push(model.agenda_activity.create(toData).then(function (response) {
            }));
        });
        Q.allSettled(promises).done(function (responses) {
            model.agendaPoint.findOne({where: {id: req.body.data},
                order: [
                    ['name', 'ASC']
                ],
                include:[
                {
                    model: model.all_category,
                    attributes: ['name']
                },{
                    model : model.agenda_activity,
                    include : [{ model: model.activity,
                        include : [{
                            model : model.task_list
                        }]
                    }]
                }]
            }).then(function(point) {
                res.send(point);
            });
        });
    });






    // _.each(record.selected, function (msg){
    //     promises.push(model.agenda_activity.findOrCreate({
    //         where: {activityId: msg.id, agendaPointId : req.body.data}
    //     }));
    // });
    // Q.allSettled(promises).done(function (responses) {
    //     var rsps = responses.map((agenda) => {
    //         return agenda.value[0].dataValues.id;
    //     });
    //     if(rsps.length > 0){
    //         var getPromises = [];
    //         _.each(rsps, function (rp,ind){
    //             var toData = {};
    //             var msg = record.selected[ind];
    //             toData.name = msg.task_list.title;
    //             toData.description = msg.description;
    //             toData.responsibility_level = msg.responsibility_level;
    //             toData.type = msg.type;
    //             toData.response_time = msg.response_time;
    //             toData.completion_time = msg.completion_time;
    //             toData.organizationId = msg.organizationId;
    //             toData.roleId = msg.roleId;
    //             toData.departmentId = msg.departmentId;

    //             toData.responseActorId = msg.responseActorId;
    //             toData.backupActorId = msg.backupActorId;
    //             toData.accountableActorId = msg.accountableActorId;
    //             console.log('---------------------',rp);
    //             getPromises.push(model.agenda_activity.update(toData, {where: { id : rp }}))
                
    //         });
    //         Q.allSettled(getPromises).done(function (responses) {
    //             model.agendaPoint.findOne({where: {id: req.body.data},
    //                 order: [
    //                     ['name', 'ASC']
    //                 ],
    //                 include:[
    //                 {
    //                     model: model.all_category,
    //                     attributes: ['name']
    //                 },{
    //                     model : model.agenda_activity,
    //                     include : [{ model: model.activity,
    //                         include : [{
    //                             model : model.task_list
    //                         }]
    //                     }]
    //                 }]
    //             }).then(function(point) {
    //                 res.send(point);
    //             });

    //         });        
    //     }
    // });
});

router.post('/update', function(req, res, next) {
    var record = req.body.data;
    model.agendaPoint.update(req.body.data, {where: { id : req.body.data.id }}).then(function (list) {
        model.agendaPoint.findOne({where: {id: req.body.data.id},
            include:[{
                model: model.all_category,
                attributes: ['name']
            },{
                model : model.agenda_activity
            }]
        })
        .then(function(agenda) {
            res.send(agenda);
        });
    });
});

router.delete("/delete/:id", function(req, res, next) {
    model.agendaPoint.destroy({where: { id : req.params.id }}).then(function(response) {
        res.send({success:true, msg: response.toString()});
    },function(response){
        model.agendaPoint.update({isDeleted:true},{where: { id : req.params.id }}).then(function(response) {
            res.send({success:true, msg: response.toString()});
        })
    });
});

module.exports = router;
