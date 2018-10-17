var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get', function(req, res, next) {
    model.department.findOne({
        where: {id: req.query.id}}).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.department.findAll({
        where: {userAccountId: req.query.userAccountId,isDeleted:false},
        order: [
            ['name', 'ASC']
        ],
    }).then(function(response) {
        res.send(response);
    });
});
router.delete('/remove/:id', function(req, res, next) {
    model.department.findOne({where: {id: req.params.id}}).then(function(item) {
        item.destroy().then(function(response) {
            res.send({success:true, msg:response.toString()});
        },function(response){
            item.update({isDeleted:true}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            })
        })
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.department.create(record).then(function(response) {
        res.send(response);
    });
});

router.post('/update', function(req, res, next) {
    model.department.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});

module.exports = router;
