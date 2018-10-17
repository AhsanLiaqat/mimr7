var express = require('express');
var router = express.Router();
var Q = require('q');
var model = require('../models');
var _ = require('underscore');
var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-west-2'
});
var sns = new AWS.SNS();

router.post('/push', function (req, res, next) {
    var to = req.body.data.to;
    var message = req.body.data.message.content;
    // _.each(to, function (Id) {
    console.log(req.body.data.message)
        model.device.findAll({
            where: {
                userId: to
            }
        }).then(function (device) {
            _.each(device, function (push) {
                console.log("devices", device)
                //+++++create sns for each result found ++++++
                sns.createPlatformEndpoint({
                    PlatformApplicationArn: process.env.Appliation_ARN_development,
                    Token: push.device_token
                }, function(err, data) {
                    if (err) {
                        console.log(err.stack);
                        return;
                    }
                    //++++++++++create end point+++++++++++++++++++
                    var endpointArn = data.EndpointArn;
                    var payload = {
                        aps: {
                            alert: {title:'Crisis Hub activation',body:message},
                            sound: 'default',
                            badge: 1
                        }
                    };
                    //+++++ final send push notification+++++++++++
                    sns.publish({
                        Message: JSON.stringify({
                            default: "Crisis Hub activation",
                            APNS: JSON.stringify(payload)
                        }),
                        MessageStructure: 'json',
                        TargetArn: endpointArn
                    }, function(err, data) {
                        if (err) {
                            console.log(err.stack);
                            return;
                        }
                        console.log('push sent');
                        console.log(data);
                    });
                });

            }); //end of inner each loop works on data found from table
        }, function (err) {
            console.log('No device token Found');
        });
    // }); //end of out each loop to find data from table
    res.send('notification sending');
});// end of main post function


module.exports = router;
