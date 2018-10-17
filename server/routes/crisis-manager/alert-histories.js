var express = require('express');
var router = express.Router();
var model = require('../../models');
var _ = require('underscore');

router.post('/save', function(req, res, next) {
    var to = req.body.data.to;
    var record ={};
    record.content = req.body.data.message.content;
    record.type = req.body.data.type;
    _.each(to, function (Id) {
        record.userId = Id;
        model.alert_history.create(record);
        if(record.type == 'Email'){
            var date = new Date();
            model.user.update({latestAlert: date }, { where:{id: Id}});
        }
    });
    res.send("True");

});
module.exports = router;
