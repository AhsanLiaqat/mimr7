var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var schedule = require('node-schedule');
var Q = require('q');
var mailServer = require('../lib/email');


router.get('/all', function(req, res, next) {
    model.survey.findAll({
        where : { articleId : req.query.id },
            include : [{
                model : model.dynamic_form
            }]
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/save', function(req, res, next) {
    var data = req.body.data;
    data.userAccountId = req.user.userAccountId;
    model.survey.create(data).then(function(survey) {
        res.send(survey);
    });
});

router.post('/update/:id',function(req,res,next){
    console.log('----',req.params.id);
    model.survey.update(req.body.data,{where: { id : req.params.id }})
    .then(function(result) {
        model.survey.findOne({
            where: {id: req.params.id}
        }).then(function(response) {
            res.send(response);
        });
    });

});


module.exports = router;
