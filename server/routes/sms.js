var express = require('express');
var router = express.Router();
var Q = require('q');
var _ = require('underscore');
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);


router.post('/send', function (req, res, next) {
    var deferred = Q.defer();
    var to = req.body.data.to;
    var message = req.body.data.message.content;
    console.log(process.env.TWILIO_PHONE);
    client.messages.create({
        body: message,
        to: to,
        from: process.env.TWILIO_PHONE
    }).then((messsage) => console.log('----------------------------------------------------------------',message));
    res.send('Sent message');
});

router.post('/smsPass', function (req, res, next) {
    var deferred = Q.defer();
    var to = req.body.data.to;
    var message = req.body.data.message;
    client.messages.create({
        body: message,
        to: to,
        from: process.env.TWILIO_PHONE
    });
    res.send('Sent message');
});


module.exports = router;
