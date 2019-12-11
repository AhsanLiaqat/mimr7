var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var Q = require('q');

router.get('/all', function(req, res, next) {
    model.article.findAll({
        where: {userAccountId: req.user.userAccountId,isDeleted : false},
            include : [{
                model : model.message,
                    include : [{
                                model : model.question
                            }
                ]},
                {model : model.chapter},{
                    model : model.question
                }]
    }).then(function(users) {
        res.json(users);
    });
});

router.get('/get/:id', function(req, res, next) {
    model.article.findOne({
        where: {id: req.params.id },
        include : [{
            model : model.chapter
        },{
            model : model.message
        }]
    }).then(function(article) {
        res.send(article);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.article.create(record).then(function (point) {
        model.article.findOne({
            where : {id : point.id},
                include : [{model : model.message},{model : model.question}]
        }).then(function(collec){
            res.send(collec);
        });
    });
});

router.post('/update/:id', function(req, res, next) {
    model.article.update(req.body.data,
        {where: { id : req.params.id }})
        .then(function(result) {
        	model.article.findOne({
		        where: {id: req.params.id }
		    }).then(function(result) {
		        res.send(result);
		    });
        });
});

router.delete('/remove/:id', function(req, res, next) {
    var id = req.params.id;
    model.article.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.article.update({isDeleted:true},{where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    })
});

module.exports = router;
