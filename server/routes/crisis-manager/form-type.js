var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/list', function(req, res, next) {
	model.formType.findAll({
		attributes: ['id','name', 'description','multiple']
	}).then(function(response) {
		res.send(response);
	});
});

router.post('/create', function(req, res, next) {

    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.formType.create(record).then(function(response) {
        res.send(response);
    });
});

router.post('/update', function(req, res, next) {
    model.formType.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
});

router.delete('/remove/:id', function(req, res, next) {
    model.formType.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    });
});


module.exports = router;
