var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');

router.get('/all/:incidentId?', function(req, res, next) {
    model.action_list.findAll({where: {
        userAccountId: req.user.userAccountId,
        isDeleted:false,
        incidentId: req.params.incidentId
        },
        order: [
            ['name', 'ASC']
        ],
        include:[{
                required: false,
                model: model.action,
                where: {
                    isDeleted:false
                },
                include:[{
                    required: false,
                    model: model.user,
                    where: {
                        isDeleted:false
                    }
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
    model.action_list.create(record).then(function (list) {
        res.send(list);
    });
});


router.post('/update', function(req, res, next) {
    var record = req.body.data;
    model.action_list.update(req.body.data, {where: { id : req.body.data.id }}).then(function (list) {
        model.action_list.findOne({
            where: { id: req.body.data.id },
            include:[{
                model: model.actions
            }]
        }).then(function (list) {
            res.send(list);
        });
    });
});


router.post("/delete", function(req, res, next) {
    model.action_list.destroy({where: { id : req.body.id }}).then(function(response) {
        res.send({success:true, msg: response.toString()});
    },function(response){
        model.action_list.update({isDeleted:true},{where: { id : req.body.id }}).then(function(response) {
            res.send({success:true, msg: response.toString()});
        })
    });
});

module.exports = router;
