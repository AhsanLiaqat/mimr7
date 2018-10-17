var express = require('express');
var router = express.Router();
var model = require('../../models');
var mailServer = require('../../lib/email');

router.post('/send', function(req, res, next) {
    var content = req.body.data;
    mailServer.sendMail(content).then(function(response) {
        console.log("response," ,response);
        res.send(response);
    }, function(err) {
        res.send(err);
        console.log(err, ' error');
    });

});

//not in use
router.post('/update', function(req, res, next) {
    model.status_report.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});

module.exports = router;
