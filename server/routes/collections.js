//articles changed as collections
var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var Q = require('q');

router.get('/all', function(req, res, next) {
    model.collection.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted : false},
            include : [{
                model : model.highlight,
                    include : [{
                                model : model.message
                            }
                ]},
                {model : model.chapter}]
    }).then(function(users) {
        res.json(users);
    });
});

router.get('/get/:id', function(req, res, next) {
    model.collection.findOne({
        where: {id: req.params.id },
        include : [{
            model : model.chapter
        },{
            model : model.highlight
        }]
    }).then(function(collection) {
        res.send(collection);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.collection.create(record).then(function (point) {
        res.send(point);
    });
});

router.post('/update/:id', function(req, res, next) {
    model.collection.update(req.body.data,
        {where: { id : req.params.id }})
        .then(function(result) {
        	model.collection.findOne({
		        where: {id: req.params.id }
		    }).then(function(result) {
		        res.send(result);
		    });
        });
});

router.delete('/remove/:id', function(req, res, next) {
    var id = req.params.id;
    model.collection.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.collection.update({isDeleted:true},{where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    })
});

module.exports = router;
