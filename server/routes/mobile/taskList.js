var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/all', function(req, res, next) {
    model.task_list.findAll({
        where: {
            userAccountId: req.query.id
        }}).then(function(references) { 
        res.send(references);
    }); 
});

module.exports = router;