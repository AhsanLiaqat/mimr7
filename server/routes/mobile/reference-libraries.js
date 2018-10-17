require('dotenv').load();
var express = require('express');
var router = express.Router();
var mimetypes = require('mime-types');
var path = require('path');
var url = require("url");
var model = require('../../models');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var fs = require('fs');
var Sequelize = require("sequelize");
var s3Library = require('../../lib/aws/s3').library;

router.get('/all', function(req, res, next) {
    model.library_reference.findAll({
        where: {
            userAccountId: req.user.userAccountId,
            isDeleted:false
        }
    }).then(function(references) {
        res.send(references);
    });
});

router.get('/get', function(req, res, next) {
    model.library_reference.findOne({
        where: {id: req.query.id}
    }).then(function(references) {
        res.send(references);
    });
});

router.get('/get-custom-lib/:help', function(req, res, next) {
    var help = req.params.help;

    console.log(help);
    model.library_reference.findOne({
        where: {
            $and: [
                {
                    userAccountId: req.user.userAccountId
                },
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('title')), Sequelize.fn('lower', help))
            ]
        }
    }).then(function(references) {
        res.send(references);
    });
});

router.get('/user-lib', function(req, res, next) {
    model.library_reference.findAll({
        where: {userAccountId: req.user.userAccountId,
            links: {
                $ne: null
            },
            isDeleted:false
        }
    }).then(function(references) {
        res.send(references);
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
    if (d.links){
        d.userId = req.user.id;
        d.url = d.links;
        var parsed = url.parse(d.url);
        d.filename  = path.basename(parsed.pathname);
        d.type = getType(d.url);
        d.userAccountId = req.user.userAccountId;
        model.library_reference.create(d).then(function(item) {
            res.json(item);
        });
    }else if(req.files.file){
        console.log(req.files.originalFilename);
        var file = req.files.file;
        d.userId = req.user.id;
        d.userAccountId = req.user.userAccountId;
        d.mimetype = mimetypes.lookup(file.originalFilename);
        d.type = getType(d.mimetype);
        d.filename = file.originalFilename;
        model.library_reference.create(d)
        .then(function(item) {
            console.log("saved", item);
            var stream = fs.createReadStream(file.path);
            console.log("upload", stream)
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

router.post('/update', function(req, res, next) {
    model.library_reference.update(req.body.data, {where: { id : req.body.data.id }}).then(function(references) {
        res.send(references);
    });
});

router.post('/remove', function(req, res, next) {
    model.library_reference.findOne({where: {id: req.body.id}}).then(function(item) {
        item.destroy().then(function(response) {
            res.send({success:true, msg:response.toString()});
        },function(response){
            item.update({isDeleted:true}).then(function(response) {
                res.send({success:true, msg:response.toString()});
            })
        })
    });
});

function saveFile(oldPath, newPath, target, res) {
    var source = fs.createReadStream(oldPath);
    var dest = fs.createWriteStream(newPath);
    source.pipe(dest);
    source.on('end', function() {
        console.log("Success")
        res.send({path: target});
    });
    source.on('error', function(err) {
        res.send(err);
    });
}

module.exports = router;
