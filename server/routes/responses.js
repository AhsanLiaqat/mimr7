var express = require('express');
var router = express.Router();
var model = require('../models');
var url = require("url");
var mimetypes = require('mime-types');
var path = require('path');
var _ = require('underscore');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var Q = require('q');
var fs = require('fs');
var s3Library = require('../lib/aws/s3').library;

router.get('/get/:id', function(req, res, next) {
    model.response.findOne({
        where: {questionId: req.params.id}}).then(function(result) {
        res.send(result);
    });
});

router.post('/save', function(req, res, next) {
    var data = req.body.data;
    model.response.create(data).then(function(rslt) {
        res.send(rslt);
    });
});

router.get('/one/:id', function(req, res, next) {
    model.question.findOne({
        where: {id: req.params.id},
        include : [{model : model.answer}]
    }).then(function(result) {
        res.send(result);
    });
});

router.get('/all-questions', function(req, res, next) {
    let condition = (req.query.id !== "All Questions") ? {articleId: req.query.id}: {};
    model.question.findAll({where: condition}).then(function(msg) {
        res.send(msg);
    });
});

router.delete('/remove/:id', function(req, res, next) {
    var id = req.params.id;
    model.response.destroy({where: {id: id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.response.update({isDeleted:true},{where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

router.post('/update/:id',function(req,res,next){
    model.response.update(req.body.data,{where: { id : req.params.id }})
    .then(function(result) {
        model.response.findOne({
            where: {id: req.params.id}
        }).then(function(response) {
            res.send(response);
        });
    });

});

router.get('/all/:id', function(req, res, next) {
    model.question.findAll({
        where: {messageId: req.params.id}}).then(function(result) {
        res.send(result);
    });
});

module.exports = router;
