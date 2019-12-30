var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get/:id', function(req, res, next) {
    model.class_list.findOne({
        where: {
            id: req.params.id
        },
        include:[{model: model.organization},
            {model : model.user}]
    }).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.class_list.findAll({ 
        where : {userAccountId : req.query.userAccountId,isDeleted:false},
        include: [
            {model: model.organization},
            {model: model.user}
    ]}).then(function(response) {
        res.send(response);
    });
});

router.post('/import-players', function(req, res, next) {
    var record = req.body.data;
    model.class_list.findOne({where: {id: req.body.listId},
        include : [{
            model: model.user
        }]
    }).then(function(item) {
        var ids = record.map(function(item, index) {
            return item.id;
        });
        item.addUsers(ids);
        res.send(item);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.class_list.create(record).then(function(response) {
        model.class_list.findOne({
            where : {id : response.id},
                include : [{
                    model : model.organization
                },{
                    model : model.user
                }]
        }).then(function(response) {
            res.send(response);
        });
    });
});

router.put('/update', function(req, res, next) {
    model.class_list.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});

router.delete("/remove/:id", function(req, res, next) {
    model.class_list.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.class_list.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

module.exports = router;
