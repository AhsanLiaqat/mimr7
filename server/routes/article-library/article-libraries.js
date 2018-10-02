var express = require('express');
var router = express.Router();
var model = require('../../models');
var url = require("url");
var mimetypes = require('mime-types');
var path = require('path');
var _ = require('underscore');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var Q = require('q');
var fs = require('fs');
var s3Library = require('../../lib/aws/s3').library;

router.post('/all/:id', function(req, res, next) {
    console.log('==================...................')
    model.article_library.findAll({where: {parentId: req.params.id}}).then(function(media) {
        res.json(media);
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

router.post('/save', multipartyMiddleware, function(req, res, next) {
    var d = req.body;
    console.log('666666666666666666666666',d)
    if (d.link != undefined){
        d.url = d.link;
        var parsed = url.parse(d.url);
        d.filename  = path.basename(parsed.pathname);
        d.type = getType(d.url);
        model.article_library.create(d).then(function(item) {
            res.json(item);
        });
    }else{
        var file = req.files.file;
        d.mimetype = mimetypes.lookup(file.originalFilename);
        d.type = getType(d.mimetype);
        d.filename = file.originalFilename;
        model.article_library.create(d)
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

// router.delete('/remove/:id', function(req, res, next) {
//     var id = req.params.id;
//     model.article.destroy({where: {id: id}}).then(function(response) {
//         res.send({success:true, msg:response.toString()});
//     },function(response){
//         model.capacity.update({isDeleted:true},{where: {id: id}}).then(function(response) {
//             res.send({success:true, msg:response.toString()});
//         })
//     })
// });

module.exports = router;
