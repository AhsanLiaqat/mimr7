var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/list', function(req, res, next) {
    model.category.findAll({where: {userAccountId: req.user.userAccountId}}).then(function(users) {
        res.json(users);
    });
});

module.exports = router;
