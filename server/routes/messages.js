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

var TYPES = ['image', 'video', 'audio', 'pdf'];
var getType = function(mime){
    console.log("=========");
    console.log(mime);
    var type = null;
    if (mime){
        TYPES.every(function(t){
            if (mime.indexOf(t) > -1){
                type = t;
                return false;
            }
            return true;
        });
    }
    return type;
};

router.post('/save-libraries', multipartyMiddleware, function(req, res, next) {
    var d = req.body;
    if (d.link != undefined){
        d.url = d.link;
        var parsed = url.parse(d.url);
        d.filename  = path.basename(parsed.pathname);
        d.type = getType(d.url);
        d.userAccountId = req.user.userAccountId;
        model.message_library.create(d).then(function(item) {
            res.json(item);
        });
    }else{
        var file = req.files.file;
        d.mimetype = mimetypes.lookup(file.originalFilename);
        d.type = getType(d.mimetype);
        d.filename = file.originalFilename;
        d.userAccountId = req.user.userAccountId;
        model.message_library.create(d)
        .then(function(item) {
            var stream = fs.createReadStream(file.path);
            s3Library.writeFile( item.s3Filename, stream, {"ContentType": item.mimetype}).then(function (err) {
                fs.unlink(file.path, function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
                item.url = "https://s3.amazonaws.com/" + s3Library.getPath(item.s3Filename);
                item.save().then(function(){
                    res.json(item);
                })
            });
        });
    }
});

router.post('/save', function(req, res, next) {
    var d = req.body.data;
    model.message.create(d).then(function(message) {
        model.message.findOne({
            where: {id: message.id}
        }).then(function(msg) {
            var io = req.app.get('io');
            var xresp = {
                data: msg,
                action: 'new'
            }
            io.emit('incoming_message:' + req.user.userAccountId,xresp)
            io.emit('incoming_message:' + message.articleId,xresp)

            res.send(message);
        });
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
