var express = require('express');
var router = express.Router();
var model = require('../../models');

router.post('/save', function(req, res, next) {
    var locations = req.body.locations;
    if(locations[0].userAccountId !== '') {
        var promise = model.location.destroy({where: {userAccountId: locations[0].userAccountId}});

        promise.then(function() {
            var fields = ['location', 'userAccountId', 'address1', 'address2', 'address3', 'city', 'state', 'country', 'officePhone', 'mobilePhone' ];
            model.location.bulkCreate(locations, {fields: fields}).then(function(response) {
                res.send(response);
            });
        });
    }
    else {
        var fields = ['location', 'userAccountId', 'address1', 'address2', 'address3', 'city', 'state', 'country', 'officePhone', 'mobilePhone' ];
        model.location.bulkCreate(locations, {fields: fields}).then(function(response){
            res.send(response);
        });
    }


});

router.get('/get', function(req, res, next) {
    model.location.findAll({ where: { userAccountId: req.query.id ,isDeleted:false}}).then(function   (response) { 
        res.send(response);
    });
});


module.exports = router;
