var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get/:id', function(req, res, next) {
    model.organization.findOne({
        where: {
            id: req.params.id,isDeleted:false
        },
        include:[{
            model: model.player_list,
                include : [{model : model.user}]
        },{model :model.user},
        {model : model.student}]
    }).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.organization.findAll({ where: {
        userAccountId: req.query.userAccountId,isDeleted:false
    },
    order: [
        ['name', 'ASC']
    ],
    include: [{
        model: model.user,
        require: false
    }]}).then(function(response) {
        res.send(response);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    record.userId = req.user.id;
    model.organization.create(record).then(function(response) {
        res.send(response);
    });
});

router.post('/update', function(req, res, next) {
    model.organization.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        model.organization.findOne({where : {id : req.body.data.id}}).then(function(respp){
            res.send(respp);
        });
    });
});

router.delete("/remove/:id", function(req, res, next) {
    model.organization.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.organization.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

module.exports = router;
