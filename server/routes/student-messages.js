var express = require('express');
var router = express.Router();
var model = require('../models');
var _ = require('underscore');
var schedule = require('node-schedule');
var Q = require('q');
var mailServer = require('../lib/email');

var j = schedule.scheduleJob('01 * * * * *', function(){
    model.student_message.findAll({
        where: {status: 'Active',isDeleted:false},
        attributes: ['id', 'setOffTime']
    }).then(function(reminder_messages) {
        reminder_messages.forEach(function(message) {
            if(new Date(message.setOffTime).getFullYear() == new Date().getFullYear() &&
               new Date(message.setOffTime).getMonth() == new Date().getMonth() &&
               new Date(message.setOffTime).getDay() == new Date().getDay() &&
               new Date(message.setOffTime).getHours() == new Date().getHours() &&
               new Date(message.setOffTime).getMinutes() == new Date().getMinutes()
            ){
                model.student_message.findOne({
                    where: {id: message.id},
                    include: [
                    {
                        model : model.user
                    }]
                }).then(function(users_data) {
                    var link = "\n\n\n\n\n\n\n\n\n\n\n\n"+'http://app.mimr7.com/#/pages/content-questions' + '/' + users_data.userId + '/' + users_data.id;
                    var mailOptions = {
                        from: 'noreply@crisishub.co',
                        to: users_data.user.email,
                        subject : 'not decided subject',
                        html: link
                    };
                    mailServer.sendMail(mailOptions);
                });
                var record = {};
                var comingDate = new Date(message.setOffTime);
                var toSave = new Date(new Date().getTime() + 1*1000*60*60);
                record.setOffTime = toSave.toISOString();
                model.student_message.update(record, {where: {id: message.id}});  
            }
        });
    });
});


router.get('/all-messages/:id', function(req, res, next) {
    model.student_message.findAll().then(function(response) {
        res.send(response);
    });
});

router.get('/get/:id', function(req, res, next) {
    model.student_message.findOne({
        where: {id: req.params.id}
    }).then(function(result) {
        res.send(result);
    });
});

router.post('/save', function(req, res, next) {
    var data = req.body.data;
    model.student_message.create(data).then(function(msg) {
        res.send(msg);
    });
});

router.delete('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    model.student_message.destroy({where: {id: id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.student_message.update({isDeleted:true},{where: {id: id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

router.post('/update',function(req,res,next){
    model.student_message.update(req.body.data,{where: { id : req.body.data.id }})
    .then(function(result) {
        model.student_message.findOne({
            where: {id: req.body.data.id }
        }).then(function(response) {
            res.send(response);
        });
    });

});

router.post('/update-status',function(req,res,next){
    model.student_message.update(req.body.data,{where: { id : req.body.data.id }})
    .then(function(result) {
        model.student_message.findOne({
            where: {id: req.body.data.id }
        }).then(function(response) {
            res.send(response);
        });
    });

});


module.exports = router;
