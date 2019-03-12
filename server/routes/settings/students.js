var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get/:id', function(req, res, next) {
    model.student.findOne({where: {id: req.params.id,isDeleted:false}}).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    let condition = (req.query.id !== "All Students") ? {organizationId: req.query.id}: {};
    model.student.findAll({where: condition}).then(function(std) {
        res.send(std);
    });
});

router.get('/all-students/:id', function(req, res, next) {
    model.student.findAll({ where: {organizationId: req.params.id,isDeleted:false}}).then(function(response) {
        res.send(response);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    model.student.create(record).then(function(response) {
        res.send(response);
    });
});

router.post('/One', function (req, res) {
    var record = req.body.data;
    model.student.findOne({
        where: { email: record.email}
    }).then(function (u) {
        res.send(u);
    });
});

router.post('/CheckEmail', function (req, res) {
    var record = req.body.data;
    model.student.findAll({
        where: { email: record.email ,id:{$ne: record.id}}
    }).then(function (u) {
        res.send(u);
    });
});

router.post('/update/:id', function(req, res, next) {
    model.student.update(req.body.data, {where: { id : req.params.id }}).then(function(response) {
        model.student.findOne({where : {id : req.params.id}}).then(function(result){
            res.send(result);
        });
    });
});

router.delete('/remove/:id', function(req, res, next) {
    model.student.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.student.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

module.exports = router;
