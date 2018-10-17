var express = require('express');
var router = express.Router();
var model = require('../../models');
router.get('/all', function(req, res, next) {
    model.action.findAll({where:{
            userAccountId: req.user.userAccountId,
            isDeleted: false,
            status: true
        }
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/update', function(req, res, next) {
    model.action.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});
router.delete('/delete/:id', function(req, res, next) {
    model.action.destroy({ where: { id: req.params.id } }).then(function (response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.action.update({isDeleted:true},{ where: { id: req.params.id } }).then(function (response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

router.delete('/reset-action-list/:actionListId', function(req, res, next) {
    model.action.destroy({ 
        where: { actionListId: req.params.actionListId } }).then(function (response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.action.update({isDeleted:true},{ where: { actionListId: req.params.actionListId } }).then(function (response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

//not in use
router.get('/get', function(req, res, next) {
    model.action.findAll({
        where: {actionPlanId: req.query.id, status: true,isDeleted: false},
        include: [{
            model: model.user,
            require: false,
            as: 'response_actor',
            attributes: ['firstName', 'lastName', 'email']
        },{
            model: model.task_list,
            attributes: ['description']
        }]}).then(function(response) {
            res.send(response);
        });
    });
//not in use
router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    if(record.id !== undefined) {
        model.action.update(record, {where: {id: record.id}}).then(function(response) {
            res.send(response);
        });
    }
    else {
        model.action.create(record).then(function(response) {
            res.send(response);
        });
    }

});
//not in use
router.post('/bulkSave', function(req, res, next) {
        var record = req.body.data;
        for(var i=0; i<record.length; i++) {
            record[i].userId = req.user.id;
            record[i].userAccountId = req.user.userAccountId;
            if(record[i].id !== undefined) {
                model.action.update(record[i], {where: {id: record[i].id}}).then(function(response) {
                    //res.send(response);
                });
            }
            else {
                model.action.create(record[i]).then(function(response) {
                    //res.send(response);
                });
            }
        }
        res.send("Successful");
    });

module.exports = router;
