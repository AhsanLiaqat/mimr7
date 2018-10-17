var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');



router.get('/list', function(req, res, next) {
    model.checkList.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [
            ['name', 'ASC']
        ],
        include:[
            {
                model: model.all_category
            },{
                model: model.task_list,
                as: 'tasks',
                attributes: ['id', 'title', 'description', 'type'],
                include: [{model: model.tag, attributes: ['id', 'text'], require: false, through: {attributes: []} }]
            }]
        })
        .then(function(list) {
            res.json(list);
        });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.checkList.create(record).then(function (list) {
        var tasks = [];
        _.each(record.tasks, function (t) {
            tasks.push(model.task_list.findOne({
                where: { id: t }
            }));
        });
        Q.allSettled(tasks).then(function (res) {
            var task = _.map(res, function (t) { return t.value });
            list.addTasks(task);
        });
        res.send(list);
    });
});

router.post('/save-incident-check-list', function(req, res, next) {
    var record = req.body.data;
    model.incident_checkList.create(record).then(function(ress){
        _.each(record.tasks, function(t){
            model.incident_checkList_copy.create({incident_checkListId: ress.id, taskId: t.id});
        });
        res.send(ress);
    });
});

router.post('/update', function(req, res, next) {
    var record = req.body.data;
    model.checkList.update(req.body.data, {where: { id : req.body.data.id }}).then(function (list) {
        model.checkList.findOne({
            where: { id: req.body.data.id }
        }).then(function (n) {
            model.incident_checkList.findOne({
                where: { checkListId: n.id ,incidentId: record.incidentId}
            }).then(function (icl) {
                _.each(record.tasks, function (u) {
                    model.task_list.findOne({
                        where: { id: u}
                    }).then(function (task) {
                        model.incident_checkList_copy.findOrCreate({
                            where: { taskId: task.id,incident_checkListId: icl.id}
                        })
                    });
                });
            });
        });
        res.send(list);
    });
});

router.delete("/delete/:id", function(req, res, next) {
    model.checkList.destroy({where: { id : req.params.id }}).then(function(response) {
        res.send({success:true, msg: response.toString()});
    },function(response){
        model.checkList.update({isDeleted:true},{where: { id : req.params.id }}).then(function(response) {
            res.send({success:true, msg: response.toString()});
        })
    });
});

module.exports = router;
