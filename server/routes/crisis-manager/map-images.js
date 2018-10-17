var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var fs = require('fs')
S3FS = require('s3fs'),
s3fsImpl = new S3FS('crisishub/maps', {
    accessKeyId: 'AKIAIWAYS57LZNHD5JMQ',
    secretAccessKey: '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'
});

router.post('/map-image', multipartyMiddleware, function(req, res, next) {
    s3fsImpl.create();
    var data = req.body.data.base64;
    var record = {};

    var base64Data = data.replace(/^data:image\/png;base64,/, "");
    var buf = new Buffer(base64Data, 'base64');
    var timeStamp = Date.now();
    record.name = timeStamp;
    record.userAccountId = req.user.userAccountId;
    record.incidentId = req.body.data.incidentId;
    var filePath = timeStamp + ".png";
    record.path = "https://s3.amazonaws.com/" + s3fsImpl.getPath(filePath);
    return s3fsImpl.writeFile(filePath, buf).then(function () {
        model.map_image.create(record).then(function(response) {
        });
        res.send({path: record.path});
    });
});

module.exports = router;
