var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');

router.get('/list', function(req, res, next) {
    model.scenario.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},
    	include: [{model: model.category}]
    }).then(function(users) {
        res.json(users);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    if(record.id){
        model.scenario.update(record, {where: {id: record.id}})
            .then(function(scenario) {
                res.json(scenario);
            });
    }else{
        model.scenario.create(record)
        .then(function(scenario) {
            res.json(scenario);
        });
    }
});

router.delete("/remove/:id", function(req, res, next) {
    var id = req.params.id;
    model.scenario.destroy({where: {id: id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.scenario.update({isDeleted:true},{where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        });
    })
});

module.exports = router;
