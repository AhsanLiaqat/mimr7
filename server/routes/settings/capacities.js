var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');

router.get('/list', function(req, res, next) {
    model.capacity.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},
    }).then(function(users) {
        res.json(users);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    if(record.id){
        model.capacity.update(record, {where: {id: record.id}})
            .then(function(capacity) {
                res.json(capacity);
            });
    }else{
        model.capacity.create(record)
            .then(function(capacity) {
                res.json(capacity);
            });
    }

});

router.post('/save-dash-board-fields', function(req, res, next) {
    var record = req.body.data;
    var saveArr = [];
    _.each(record, function (c) {
        saveArr.push(model.capacity.update(c, {where: {id: c.id}}));
    });

    Q.allSettled(saveArr).then(function (ress) {
        res.send(ress);
    });
    // record.userAccountId = req.user.userAccountId;

});

router.delete('/remove/:id', function(req, res, next) {
    var id = req.params.id;
    model.capacity.destroy({where: {id: id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.capacity.update({isDeleted:true},{where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    })
});

module.exports = router;
