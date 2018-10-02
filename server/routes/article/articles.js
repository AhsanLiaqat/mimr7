var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');
var Q = require('q');

router.get('/all', function(req, res, next) {
    model.article.findAll({where: {userAccountId: req.user.userAccountId}}).then(function(users) {
        res.json(users);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.article.create(record).then(function (point) {
        res.send(point);
    });
});

// router.delete('/remove/:id', function(req, res, next) {
//     var id = req.params.id;
//     model.article.destroy({where: {id: id}}).then(function(response) {
//         res.send({success:true, msg:response.toString()});
//     },function(response){
//         model.capacity.update({isDeleted:true},{where: {id: id}}).then(function(response) {
//             res.send({success:true, msg:response.toString()});
//         })
//     })
// });

module.exports = router;
