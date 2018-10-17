var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get("/all", function (req, res, next) {
    console.log('hit');
    model.incident.findAll({
        where: {
            active: 'Active',
            userAccountId: req.query.userAccountId
        }, include: [{
            model: model.place,
            require: false,
            as: 'locations'
        }, {
            model: model.incident_plan,
            require: false,
            attributes: ['id', 'plan_activated', 'actionPlanId', 'selected'],
            include: [{model: model.action_plan, attributes: ['id', 'name', 'description', 'status', 'type', 'plandate', 'categoryId']}]
        }]
    }).then(function (response) {
        var data = response.map(function (incident) {
            incident = incident.toJSON();
            var locs = incident.locations.map(function (loc) {
                return {
                    id: loc.id,
                    address: loc.location.formatted_address,
                    geometry: loc.location.geometry.location
                }
            });
            incident.locations = locs;
            return incident;
        });
        console.log(data);
        res.send(data);
    }, function (err) {
        console.log(err);
        res.send()
    });
});

module.exports = router;
