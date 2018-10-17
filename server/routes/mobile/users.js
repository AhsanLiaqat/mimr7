var express = require('express');
var router = express.Router();
var model = require('../../models');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var Q = require('q');
var _ = require('underscore');
var fs = require('fs')

S3FS = require('s3fs'),

s3fsImpl = new S3FS('crisishub/users', {
    accessKeyId: 'AKIAIWAYS57LZNHD5JMQ',
    secretAccessKey: '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'
});

var path = require('path');

/* GET users listing. */
router.get('/me', function (req, res, next) {
    model.user.findOne({
        where: { id: req.user.id },
        include: [
            { model: model.user_accounts }
        ]
    }).then(function (user) {
        res.json(user);
    });
});

router.get('/list', function (req, res) {
    model.user.findAll({
        where: { userAccountId: req.user.userAccountId, userType: null },
        include: [
            {
                model: model.department,
                require: false
            }]
    }).then(function (users) {
        res.send(users);
    });
});

router.get('/internalList', function (req, res) {
    model.user.findAll({
        where: { userAccountId: req.user.userAccountId, userType: null }
    }).then(function (users) {
        res.send(users);
    });
});

router.get('/externalList', function (req, res) {
    model.user.findAll({
        where: { userAccountId: req.user.userAccountId, userType: "External" },
        include: [
            {
                model: model.organization,
                attributes: ['name']
            }]
    }).then(function (users) {
        res.send(users);
    });
});

router.get('/list2', function (req, res) {
    model.user.findAll().then(function (users) {
        res.send(users);
    });
});

router.post('/create', function (req, res, next) {
    var user = req.body.data;
    user.userAccountId = req.user.userAccountId;
    model.user.create(user).then(function (user) {
        res.send(user);
    });
});

router.post('/create2', function (req, res, next) {
    model.user.create(req.body.data).then(function (user) {
        res.send(user);
    });
});

router.post('/update', function (req, res, next) {
    var user = req.body;
    model.user.update(user, { where: { id: user.id } }).then(function (user) {
        // var data = {};
        // data.type = "user_update";
        // var owner = CH.wss._server._handle.owner;
        // CH.wss.broadcast(JSON.stringify(data), owner);
        res.send(user);
    });
});

router.post('/get', function (req, res, next) {
    model.user.findOne({
        where: { id: req.body.id }
    }).then(function (user) {
        res.send(user);
    });
});

router.get('/department', function (req, res, next) {
    model.user.findAll({
        where: { departmentId: req.query.id }
    }).then(function (users) {
        res.send(users);
    });
});

router.get('/account', function (req, res, next) {
    model.user.findAll({
        where: { userAccountId: req.query.id }
    }).then(function (user) {
        res.send(user);
    });
});

router.post('/delete', function (req, res, next) {
    model.user.destroy({ where: { id: req.body.id } }).then(function (user) {
        res.json({ message: "Success" });
    });
});

router.post('/avatar', multipartyMiddleware, function (req, res, next) {
    s3fsImpl.create();
    var file = req.files.file;
    var stream = fs.createReadStream(file.path);
    return s3fsImpl.writeFile(file.originalFilename, stream).then(function (err) {
        fs.unlink(file.path, function (err) {
            if (err) {
                console.error(err);
            }
        });
        var target = "https://s3.amazonaws.com/" + s3fsImpl.getPath(file.originalFilename);
        res.send({ path: target });
        //  res.status(200).end();
    });

    // var oldPath = req.files.file.path;
    // var type = req.files.file.type.split('/');
    // var ext = type[1];
    // var path = "/uploads/users/" + Math.round(new Date().getTime()/1000) + '.' + ext;
    // var newPath = process.cwd() + "/client" + path;
    // saveFile(oldPath, newPath, "", path, res);

});

router.get('/countries', function (req, res, next) {
    model.country.findAll().then(function (users) {
        res.json(users);
    })
});

var evaluateOutcomes = function (outcomes) {
    var deferred = Q.defer();
    var activities = [];
    
    _.each(outcomes, function (activity) {
        activities.push(model.activity.findOne({
            where: { id: activity.action },
            attributes: ['id', 'description', 'type'],
            include: [
                { model: model.task_list, attributes: ['title'] },
                {
                    model: model.user,
                    as: 'response_actor',
                    attributes: ['id', 'available'],
                }
            ]
        }));
    });
    deferred.resolve(activities);
    return deferred.promise;
}

router.get('/activities', function (req, res, next) {

    model.incident_plan.findOne({
        where: { incidentId: req.query.incidentId },
        attributes: ['id', 'plan_activated', 'activity_status'],
    }).then(function (incident_plan) {
        if (incident_plan) {
            var activities = [];
            _.each(incident_plan.activity_status, function (status) {
                activities.push(model.activity.findOne({
                    where: { id: status.activityId },
                    attributes: ['id', 'description', 'type', 'outcomes'],
                    include: [
                        { model: model.task_list, attributes: ['title'] },
                        {
                            model: model.user,
                            as: 'response_actor',
                            attributes: ['id', 'available'],
                        }
                    ]
                }));
            });

            Q.allSettled(activities)
                .then(function (res) {
                    var statuses = _.map(res, function (activity, index) {
                        return {
                            id: activity.value.id,
                            title: activity.value.task_list.title,
                            description: activity.value.description,
                            completion_time: activity.value.completion_time,
                            type: activity.value.type,
                            outcomes: activity.value.outcomes,
                            activity_status: incident_plan.activity_status[index].task_status,
                            activity_activated: incident_plan.activity_status[index].activated,
                            selected_outcome: incident_plan.activity_status[index].selected_outcome,
                            responseActorId: activity.value.response_actor.id,
                            responseActorAvailable: activity.value.response_actor.available,
                        }
                    });
                    incident_plan.activities = statuses;
                }).then(function (res) {
                    var activities = [];
                    var outcomes = [];

                    incident_plan.activities.forEach(function (activity) {
                        if (activity.type === 'decision' && activity.outcomes.length > 0) {
                            activity.outcomes.forEach(function (outcome) {
                                outcomes.push(outcome);
                            });
                        }
                    });

                    return evaluateOutcomes(outcomes);

                }).then(function (activities) {
                    var statuses = _.map(activities, function (activity, index) {
                        // return {
                        //  id: activity.value.id,
                        //  title: activity.value.task_list.title,
                        //  description: activity.value.description,
                        //  completion_time: activity.value.completion_time,
                        //  type: 'outcome',
                        //  activity_status: incident_plan.activity_status[index].task_status,
                        //  activity_activated: incident_plan.activity_status[index].activated,
                        //  selected_outcome: incident_plan.activity_status[index].selected_outcome,
                        //  responseActorId: activity.value.response_actor.id,
                        //  responseActorAvailable: activity.value.response_actor.available,
                        // }
                    });
                });

            Q.allSettled(activities).done(function (results) {
                var data = {}
                data.activities = incident_plan.activities;
                data.plan_status = incident_plan.plan_activated;
                data.incident_plan_id = incident_plan.id;
                res.send(data);
            });
        } else {
            res.status(500);
            res.json({
                "error": true,
                "message": 'No Action Plan linked to the incident.'
            });
        }
    }, function (err) {
        res.status(500);
        res.json({
            "error": true,
            "message": err.message
        });
    });
});


router.post('/save', function (req, res, next) {
    var user = req.body.user;
    user.userAccountId = req.user.userAccountId;
    var accounts = req.body.accounts;
    if (user.password == '') delete user.password;
    model.user.update(user, { where: { id: req.user.id }, fields: ['firstName', 'lastName', 'password', 'role', 'avatar'] });
    if (accounts.id !== undefined) {
        model.user_accounts.update(accounts, { where: { id: accounts.id } }).then(function (response) {
            res.send(response);
        });
    }
    else if (accounts.id === undefined) {
        model.user_accounts.create(accounts).then(function (response) {
            res.send(response);
        });
    }

});

router.post('/test', multipartyMiddleware, function (req, res, next) {
    var oldPath = req.files.file.path;
    var type = req.files.file.type.split('/');
    var ext = type[1];
    var path;
    var type = req.body.type;
    if (req.body.type === 'Organization') {
        path = "/uploads/organizations/" + Math.round(new Date().getTime() / 1000) + '.' + ext;
        var newPath = process.cwd() + "/client" + path;
    }
    else if (req.body.type === 'User') {
        path = "/uploads/users/" + Math.round(new Date().getTime() / 1000) + '.' + ext;
        var newPath = process.cwd() + "/client" + path;
    }

    saveFile(oldPath, newPath, type, path, res);
});

function saveFile(oldPath, newPath, type, target, res) {
    var source = fs.createReadStream(oldPath);
    var dest = fs.createWriteStream(newPath);
    source.pipe(dest);
    source.on('end', function () {
        res.send({ path: target, type: type });
    });
    source.on('error', function (err) {
        res.send(err);
    });
}


module.exports = router;
