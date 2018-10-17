var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');



router.get('/all', function (req, res, next) {
    model.incident_shape.findAll({
        where: {
            incidentId: req.query.incidentId,
            isDeleted: false
        }
    }).then(function (response) {
        res.send(response);
    }, function (err) {
        console.log(err);
        res.send()
    });
});

router.post("/save", function (req, res, next) {
    var data = req.body;
    console.log(data);
    model.incident_shape.findOne({
        where: { incidentId: data.incidentId }
    }).then(function (result) {
        if (result == null){
            model.incident_shape.create(data).then(function(response) {
                res.send(response);
            });
        }else{
            model.incident_shape.update(data, {where: {incidentId: data.incidentId}}).then(function(response) {
                res.send(response);
            });
        }
    });
});
module.exports = router;
