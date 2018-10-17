var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DB_URL, {logging: false});

router.get('/all', function (req, res, next) {
    sequelize.query('SELECT Distinct on ("tags"."text") "id", "text" FROM "tags" as "tags"')
        .spread((results, metadata) => {
        res.send(results);
    });
});

router.get('/get-account-tags', function(req, res, next) {
    model.tag.findAll({
        where: {userAccountId: req.query.userAccountId,isDeleted:false}}).then(function(response) {
            res.send(response);
    });
});

router.post('/bulk-save', function (req, res, next) {
    var tags = req.body.data;
    var newTags = [];
    var filteredTags = [];
    _.each(tags, function (tag) {
        newTags.push(model.tag.findOrCreate({where: {
            text: tag.text,
            userAccountId: req.user.userAccountId
        }}));
    });

    Q.allSettled(newTags).then(function (response) {
        res.sendStatus(200);
    });
});

module.exports = router;
