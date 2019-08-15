var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var Q = require('q');

router.get('/get/:id', function(req, res, next) {
    model.chapter.findOne({
        where: {id: req.params.id }
    }).then(function(chapt) {
        res.send(chapt);
    });
});

router.get('/all', function(req, res, next) {
    model.chapter.findAll({ where : {userAccountId : req.query.userAccountId},
        include : [{model : model.article}]
    }).then(function(chapt) {
        res.send(chapt);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.chapter.create(record).then(function (chap) {
        res.send(chap);
    });
});

router.post('/update/:id',function(req,res,next){
    model.chapter.update(req.body.data,{where: { id : req.params.id }})
    .then(function(result) {
        model.chapter.findOne({
            where: {id: req.params.id}
        }).then(function(response) {
            res.send(response);
        });
    });

});

router.delete('/delete/:id/:articleId', function(req, res, next) {
    var id = req.params.id;
    model.chapter.destroy({where: {id: id}}).then(function(response) {
        model.chapter.findAll({where : {articleId : req.params.articleId}}).then(function(chapters){
            res.send(chapters);
        });
    },function(response){
        model.chapter.update({isDeleted:true},{where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

module.exports = router;
