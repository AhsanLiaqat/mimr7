var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');
var socket = require('../../lib/socket');

router.post('/save', function(req, res, next) {
    var record = req.body.data;
	var count = 0
    model.incident_checkList.create(record).then(function(inci_checklist) {
        model.checkList.findOne({
            where: {id: record.checkListId,isDeleted: false},
            attributes: ['id', 'name'],
            include: [{model: model.task_list,as:'tasks', attributes: ['id', 'title'], require: false, through: {attributes: []} }]
        }).then(function(checkList) {
            _.each(checkList.tasks, function (t) {
                var data = {};
                data.incident_checkListId = inci_checklist.id;
                data.taskId = t.id;
                model.incident_checkList_copy.create(data).then(function(res){
					count += 1;
					if(checkList.tasks.length === count){
						var inciChkId = inci_checklist.toJSON().id;
						model.incident_checkList.findOne({
							where: {id: inciChkId,isDeleted: false},
							attributes: ['id','incidentId'],
							include: [{
								model: model.incident_checkList_copy,
								include:[{
									model: model.task_list
								}]
							},
							{
								model: model.checkList,
								include: [{
									model: model.all_category,
									attributes: ['id', 'name']
								}]
							}]
						}).then(function(result) {
							result = result.toJSON();
							var io = req.app.get('io');
							var data = {
								data: result,
								action: "new"
							}
							io.emit('incident_check_list:' + result.incidentId,data)
						});
					}
				});
            });
            res.send(inci_checklist);
        });
    });
});

router.get('/all-copies', function(req, res, next) {
    var copies = [];
    model.incident_checkList.findAll({
        where: {incidentId: req.query.id,isDeleted: false},
        attributes: ['id'],
        include: [{
			model: model.incident_checkList_copy,
            include:[{
				model: model.task_list
			}]
		},
        {
			model: model.checkList,
            include: [{
				model: model.all_category,
                attributes: ['id', 'name']
            }]
        }]
    }).then(function(result) {
        res.send(result);
    });
});

router.post('/update-task', function(req, res, next) {
    model.incident_checkList.findOne({
        where: {incidentId: req.body.data.incidentId, checkListId: req.body.data.checkListId}
    }).then(function(inci_checklist) {
        model.incident_checkList_copy.findOne({
            where: {incident_checkListId: inci_checklist.dataValues.id, taskId: req.body.data.taskId}
        }).then(function(copy) {
            var record = {};
            record.status = req.body.data.taskStatus
            model.incident_checkList_copy.update(record, {where: {id: copy.dataValues.id}}).then(function(response) {
				var io = req.app.get('io');
				var data = {
					data: req.body.data,
					action: "update"
				}
				io.emit('incident_check_list:' + req.body.data.incidentId,data)
                res.send(response);
            });
        });
    });

});

router.delete('/remove/:checkListId/:incidentId', function(req, res, next) {
	var io = req.app.get('io');
    model.incident_checkList.findOne({
        where: {incidentId: req.params.incidentId, checkListId: req.params.checkListId}
    }).then(function(inci_checklist) {
        model.incident_checkList_copy.destroy({
            where: {incident_checkListId: inci_checklist.id}
        }).then(function(status) {
            model.incident_checkList.destroy({
                where: {incidentId: req.params.incidentId, checkListId: req.params.checkListId}
            }).then(function(response) {
				var data = {
					data: {id: req.params.checkListId},
					action: "delete"
				}
				io.emit('incident_check_list:' + req.params.incidentId,data)
				res.send({success:true, msg:response.toString()});
            },function(response){
                model.incident_checkList.update({isDeleted:true},{
                    where: {incidentId: req.params.incidentId, checkListId: req.params.checkListId}
                }).then(function(response) {
					var data = {
						data: {id: req.params.checkListId},
						action: "delete"
					}
					io.emit('incident_check_list:' + req.params.incidentId,data)
                    res.send({success:true, msg:response.toString()});
                })
            });
        },function(response){
            res.send({success:false, msg:response.toString()});
        });
        var data ={};
        data.type = "incident_update:" + inci_checklist.incidentId;
        data.plan = inci_checklist;
        socket.notify(data.type, data);
    });

});

module.exports = router;
