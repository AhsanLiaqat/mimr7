var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');

router.get('/all', function(req, res, next) {
    model.custom_message.findAll({
        where: { userAccountId: req.user.userAccountId,isDeleted:false}
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    if(record.id !== undefined) {
        model.custom_message.update(record, {where: {id: record.id}}).then(function(response) {
            res.send(response);
        });
    }
    else {
        model.custom_message.create(record).then(function(response) {
            res.send(response);
        });
    }

});

router.get('/get', function(req, res, next) {
    model.custom_message.findOne({
        where: { userAccountId: req.user.userAccountId,
            id: req.query.id
        }
    }).then(function(response) {
        res.send(response);
    });
});

router.get('/activation-message', function(req, res, next) {
    console.log('-----------------',req.query,req.user.userAccountId);
    model.custom_message.findOne({
        where: {
            userAccountId: req.user.userAccountId,
            msgType: req.query.type,
            msgTemplateType: req.query.template
        }
    }).then(function(response) {
        res.send(response);
    });
});

router.get('/default-templates', function(req, res, next) {
    var typeArr = ['Action Plan', 'Incident', 'Activate Team'];
    var tmpArr = ['Email', 'SMS'];
    _.each(typeArr, function (type) {
        _.each(tmpArr, function (tmp) {
            var data = {};
            data.userAccountId = req.query.userAccountId;
            data.subject = 'Attentie!';
            data.content = 'Klik op de onderstaande link om uw takenlijst te bekijken. Log in met uw email adres en password.';
            data.msgType = type;
            data.msgTemplateType = tmp;
            model.custom_message.create(data).then(function(response) {
                //   res.send(response);
            });
        });
    });
    var data = {};
    data.userAccountId = req.query.userAccountId;
    data.subject = 'Attentie!';
    data.content = '';
    data.msgType = 'Type 1';
    data.msgTemplateType = 'Button';
    model.custom_message.create(data).then(function(response) {
        data.msgType = 'Type 2';
        model.custom_message.create(data).then(function(response) {
            data.msgType = 'Type 3';
            model.custom_message.create(data).then(function(response) {
                data.msgType = 'Type 4';
                model.custom_message.create(data).then(function(response) {
                });
            });
        });
    });
    res.send("Success");
});

router.delete('/remove/:id', function (req, res, next) {
    model.custom_message.destroy({ where: { id: req.params.id } }).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.custom_message.update({isDeleted:true},{ where: { id: req.params.id } }).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    })
});

module.exports = router;
