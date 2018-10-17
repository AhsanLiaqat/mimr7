var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/get', function(req, res, next) {
    model.default_category.findOne({
        where: {id: req.query.id}}).then(function(response) {
        res.send(response);
    });
});

router.get('/all', function(req, res, next) {
    model.default_category.findAll({where: {categoryId: req.query.id,isDeleted:false}}).then(function(response) {
        res.send(response);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    record.userId = req.user.id;
    model.default_category.create(record).then(function(response) {
        res.send(response);
    });
});

router.post('/set-position', function(req, res, next) {
    var record = req.body.data;
    model.default_category.update({position: record.position}, {where :{id: record.id}}).then(function(response){
        res.send(response);
    })

});

router.post('/update', function(req, res, next) {
    model.default_category.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});

router.delete('/remove/:id', function(req, res, next) {
    model.default_category.destroy({where: { id : req.params.id }}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.default_category.update({isDeleted:true},{where: { id : req.params.id }}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

router.get('/all-categories', function(req, res, next) {
    model.default_category.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted:false},
        include: [{ model: model.category,
            attributes: ['name']
        }]
    }).then(function(result) {
        res.json(result);
    });
});

router.post('/category-save', function(req, res, next) {
    model.default_category.create(req.body.data).then(function(response) {
        res.send(response);
    });
});
module.exports = router;
