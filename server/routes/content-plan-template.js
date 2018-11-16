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

router.get('/all', function(req, res, next) {
    let condition = (req.query.id !== "All Messages") ? {articleId: req.query.id}: {};
    model.message.findAll({where: condition}).then(function(msg) {
        res.send(msg);
    });
});

router.get('/get', function(req, res, next) {
    model.message.findOne({
        where: {id: req.query.id}}).then(function(result) {
        res.send(result);
    });
});

router.post('/update', function(req, res, next) {
    model.message.update(req.body.data, {where: { id : req.body.data.id }}).then(function(result) {
        model.message.findOne({
            where: {id: req.body.data.id}}).then(function(result) {
            var io = req.app.get('io');
            var xresp = {
                data: result,
                action: 'update'
            }
            // console.log('incoming_message:' + req.user.userAccountId)
            io.emit('incoming_message:' + req.user.userAccountId,xresp)
            io.emit('incoming_message:' + result.articleId,xresp)

            res.send(result);
        });

    });

});

router.post('/create', function(req, res, next) {
    var record = req.body;
    record.userAccountId = req.user.userAccountId;
    model.content_plan_template.create(record).then(function(contentPlanTmplate) {
        res.send(contentPlanTmplate)
    });
});

router.delete('/remove/:id', function(req, res, next) {
    var id = req.params.id;
    model.message.findOne({where : {id : id}}).then(function(result){
        model.message.destroy({where: {id: id}}).then(function(response) {
            var io = req.app.get('io');
            var xresp = {
                data: result,
                action: 'delete'
            }
            io.emit('incoming_message:' + req.user.userAccountId,xresp)
            io.emit('incoming_message:' + result.articleId,xresp)
            res.send({success:true, msg:response.toString()});
        },function(response){
            model.message.update({isDeleted:true},{where: {id: id}}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            })
        });
    });
});

module.exports = router;
