var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get/:id', function(req, res, next) {
    model.user.findOne({where: {id: req.params.id,isDeleted:false}}).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    let condition = (req.query.id !== "All Students") ? {userAccountId : req.query.userAccountId, organizationId: req.query.id,type : 'student'}: {userAccountId : req.query.userAccountId, type : 'student'};
    model.user.findAll({where: condition,
        include : [{model : model.question_scheduling,
            include : [{
                model : model.answer
            },{
                model : model.question
            }]
        }]
    }).then(function(std) {
        res.send(std);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.user.create(record).then(function(response) {
        model.user.findOne({
            where: { id: response.id},
                include : [{model : model.question_scheduling,
                    include : [{
                        model : model.answer
                    }]
                }]
        }).then(function (u) {
            res.send(u);
        });
    });
});

router.post('/One', function (req, res) {
    var record = req.body.data;
    model.user.findOne({
        where: { email: record.email}
    }).then(function (u) {
        res.send(u);
    });
});

router.get('/find-all', function(req, res, next) {
    model.user.findAll({where: {userAccountId :req.query.userAccountId,type : 'student'} ,
        include : [{model : model.question_scheduling,
            include : [{
                model : model.answer
            },{
                model : model.question
            }]
        }]
    }).then(function(std) {
        res.send(std);
    });
});


router.post('/CheckEmail', function (req, res) {
    var record = req.body.data;
    model.user.findAll({
        where: { email: record.email ,id:{$ne: record.id}}
    }).then(function (u) {
        res.send(u);
    });
});

router.post('/update/:id', function(req, res, next) {
    model.user.update(req.body.data, {where: { id : req.params.id }}).then(function(response) {
        model.user.findOne({where : {id : req.params.id},
            include : [{model : model.question_scheduling,
                include : [{
                    model : model.answer
                }]
            }]
        }).then(function(result){
            res.send(result);
        });
    });
});

router.delete('/remove/:id', function(req, res, next) {
    model.user.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.user.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

router.get('/all-students/:id', function(req, res, next) {
    model.student.findAll({ where: {organizationId: req.params.id,isDeleted:false}}).then(function(response) {
        res.send(response);
    });
});

module.exports = router;
