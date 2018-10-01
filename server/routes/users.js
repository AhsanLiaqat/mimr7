var express = require('express');
var router = express.Router();
var model = require('../models');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var randomstring = require("randomstring");
var fs = require('fs');
var Q = require('q');
var _ = require('underscore');
var socket = require('../lib/socket');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DB_URL,{logging: false});
var nJwt = require('njwt');
var bcrypt = require('bcryptjs');


S3FS = require('s3fs'),

s3fsImpl = new S3FS ('crisishub/users', {
    accessKeyId: 'AKIAIWAYS57LZNHD5JMQ',
    secretAccessKey: '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'
});

var path = require('path');

/* GET users listing. */
router.get('/me', function (req, res, next) {
    var user = undefined;
    if(req.user){
        model.user.findOne({
            where: { id: req.user.id,isDeleted:false },
            attributes: ['id','email','avatar','firstName','lastName','role','officePhone','userType','enabled','available','createdAt','updatedAt','userAccountId'],
            include: [
                {
                    model: model.user_accounts,
                    attributes: ['id','organizationName','type','category_header','messages_font_size','messages_font_family','status','createdAt','updatedAt']
                }
                // ,
                // {
                //     model: model.role,
                //     attributes: ['id','name','createdAt','updatedAt','userAccountId']

                // }
            ]
        }).then(function (user) {
            res.json(user);
        });
    }
    else{
        res.json(user);
    }
});

router.get('/list', function (req, res) {
    model.user.findAll({
        where: { userAccountId: req.user.userAccountId, userType: null ,isDeleted:false},
        order: [['firstName', 'ASC']],
        include: [{
            model: model.department,
            attributes: ['name'],
            required: false
        },{
            model: model.role,
            required: false,
            attributes: ['name']
        },
        {
            model: model.incidents_team,
            attributes: ['name']
        }]
    }).then(function (users) {
        res.send(users);
    });
});

// This API needs to be worked on after modifying the data structure for current SentTo field
router.get('/statusList', function(req, res) {
    model.user.findAll({
        where: { userAccountId: req.user.userAccountId, userType: null }
    }).then(function (users) {
        res.send(users);

        var alerts = [];
            _.each(users, function (user) {
                alerts.push(model.email_tracking.findOne({
                    where: ["sentTo like ?", '%' + user.email + '%']
                }));
            });

            Q.allSettled(alerts).then(function (res) {
                alerts = _.map(res, function (alert) {
                    return {
                        alert: alert.value
                    }
                });
            });

            Q.allSettled(alerts).done(function (results) {
                res.send(results);
            });
    });
});

router.get('/internalList', function (req, res) {
    model.user.findAll({
        where: { userAccountId: req.user.userAccountId, userType: null , isDeleted:false },
        order: [
      ['firstName', 'ASC'], // Sorts by firstName in ascending order
    ],
    include:[{
        model: model.role
        }]
    }).then(function (users) {
        res.send(users);
    });
});

router.post('/One', function (req, res) {
    var record = req.body.data;
    model.user.findOne({
        where: { email: record.email}
    }).then(function (u) {
        res.send(u);
    });
});

router.post('/updateActivationEmail', function (req, res) {
    var record = req.body.data;
    var date = Date.now();
    model.user.update({LastEmailActivation: date}, {
        where: { email: record.email}
    }).then(function (u) {
        res.send(u);
    });
});

router.post('/updateChangePassword', function (req, res) {
    var record = req.body.data;
    var date = Date.now();
    model.user.update({LastUpdatePassword: date}, {
        where: { id: record.id}
    }).then(function (u) {
        res.send(u);
    });
});


router.post('/CheckEmail', function (req, res) {
    var record = req.body.data;
    model.user.findAll({
        where: { email: record.email ,id:{$ne: record.id}}
    }).then(function (u) {
        res.send(u);
    });
});

router.post('/verify', function (req, res) {
    var record = req.body.data;
    model.user.findOne({
        where: { email: record.email, password: record.password}
    }).then(function (u) {
        res.send(u);
    });
});

router.post('/verifyEmail', function (req, res) {
    var record = req.body.data;
    if(record.email){
        model.game_player.findOne({
            where: { email: record.email}
        }).then(function (u) {
            if(u){
            var new_jwt = nJwt.create({id: u.dataValues.id},process.env.JWT_SECRET);
            var auth_token = new_jwt.compact();
            return res.json({   success:true,
                id: u.dataValues.id,
                token: auth_token,
                role: u.dataValues.role,
                name: u.dataValues.firstName+' '+u.dataValues.lastName,
                email: u.dataValues.email,
                userId: u.dataValues.id,
                userAccountId: u.dataValues.userAccountId });
            // res.send(u);
            }
            else
            {
                res.send('record not found');
            }
        });
    }else{
       res.send('No Email Provided.');
    }
});



router.post('/findOne', function (req, res) {
    var record = req.body.data;
    console.log(record);
    sequelize.query('SELECT * FROM "users" WHERE email = ? and "users"."mobilePhone" like ?',
        { replacements: [record.email, "%"+record.mobilePhone], type: sequelize.QueryTypes.SELECT }
    ).then(u => {
        console.log(u[0]);
        if(u[0] && u[0].id){
        u.password = randomstring.generate(8);
        model.user.update(u[0], { where: { id: u[0].id } }).then(function (user) {
            console.log('here');
        });
        res.send(u[0]);
        }else{
            res.send("not found");
        }
    })
});

router.post('/teamUserList', function (req, res) {
    var data = [];
    data = req.body.data
    model.user.findAll({
        where: { id: data}
    }).then(function (users) {
        res.send(users);
    });
});

router.get('/externalList', function (req, res) {
    model.user.findAll({
        where: { userAccountId: req.user.userAccountId, userType: "External" },
        order: [
      ['firstName', 'ASC'], // Sorts by COLUMN_NAME_EXAMPLE in ascending order
        ],
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
        // res.send(user);
        if(req.body.data.roles != undefined){
            var roles = [];
            _.each(req.body.data.roles, function (u) {
                roles.push(model.role.findOrCreate({
                    where: { id: u }
                }));
            });
            Q.allSettled(roles).then(function (res) {
                var role = _.map(res, function (u) { return u.value[0] });
                user.addRoles(role);
            });
            res.send(user);
        }else{
            res.send(user);
        }

    });
});

router.post('/create2', function (req, res, next) {
    model.user.create(req.body.data).then(function (user) {
        res.send(user);
    });
});

router.post('/updateStatus',function(req,res,next){
       var user=req.body.data;
       console.log(req.body.data.id);
       var data = {available: user.available};
       model.user.update(data,{where:{ id: req.body.data.id } }).then(function(user){
              res.send(user);
       });
});

var userUpdate = function(user,id,sent_roles,res){
    console.log('---------------------------',user);

    model.user.update(user, { where: { id: id }}).then(function (user) {
        var data = { type: "user_update", user: user};
        socket.broadcast(user.userAccountId, data);
        if (sent_roles != undefined) {
            var roles = [];
            _.each(sent_roles, function (u) {
                roles.push(model.role.findOrCreate({
                    where: { id: u }
                }));
            });
            Q.allSettled(roles).then(function (resp) {

                var role = _.map(resp, function (u) { return u.value[0] });
                var roleIds = _.map(role, function (u) { return u.id });
                model.user.findOne({
                    where: { id: id }
                }).then(function (n) {
                    n.setRoles(roleIds);
                });
            });
            res.send(user)
        }else{
            res.send(user);
        }
    });
};

router.post('/update', function (req, res, next) {
    var user = req.body.data;
    if (user.password === '') delete user.password;
    if(user.current_pass){
        model.user.findOne({
            attributes: ['id','password','userAccountId'],
            where: { id: user.id,isDeleted:false }
        }).then(function (dbuser) {
            bcrypt.compare(user.current_pass, dbuser.password, function(err, resp) {
                if( resp == true ){
                    user.password = user.new_pass;
                    delete user.current_pass;
                    delete user.new_pass;
                    bcrypt.hash(user.password, 16).then(function(hash) {
                        user.password = hash;
                        userUpdate(user,req.body.data.id,req.body.data.roles,res);
                    });
                }else{
                    if(user.current_pass == dbuser.password){
                        user.password = user.new_pass;
                        delete user.current_pass;
                        delete user.new_pass;
                        bcrypt.hash(user.password, 16).then(function(hash) {
                            user.password = hash;
                            userUpdate(user,req.body.data.id,req.body.data.roles,res);
                        });
                    }else{
                        res.json({success: false, message: 'Password didnt matched.'});
                        //pass not matched
                    }
                }
            });
        });
    }else{
        if(user.new_pass){
            user.password = user.new_pass;
            bcrypt.hash(user.password, 16).then(function(hash) {
                user.password = hash;
                userUpdate(user,req.body.data.id,req.body.data.roles,res);
            });
        }else{
            if (user.password) delete user.password;
            userUpdate(user,req.body.data.id,req.body.data.roles,res);
        }
    }
    
    // res.send({});

});

router.post('/get', function (req, res, next) {
    model.user.findOne({
        attributes: ['id','email','avatar','firstName','lastName','role','officePhone','userType','enabled','available','createdAt','updatedAt','userAccountId', 'middleName','departmentId','mobilePhone', 'countryCode'],
        where: { id: req.body.id,isDeleted:false },
        include: [
            {
                model: model.user_accounts,
                attributes: ['id','organizationName','type','category_header','messages_font_size','messages_font_family','status','createdAt','updatedAt']
            },{
                model: model.role,
                attributes: ['id','name','createdAt','updatedAt','userAccountId']

            }
        ]
    }).then(function (user) {
        res.send(user);
    });
});


router.get('/clear-image/:id', function (req, res, next) {
    model.user.update({avatar: null}, { where: { id: req.params.id }}).then(function (user) {
        console.log('iasdasdasd..............',user);
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
    model.user.destroy({ where: { id: req.body.id } }).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.user.update({isDeleted:true},{ where: { id: req.body.id } }).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    })
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
    });
});

router.post('/editorImage', multipartyMiddleware, function (req, res, next) {
    console.log("===============");
    var file = req.files.file;
    var stream = fs.createReadStream(file.path);
    return s3fsImpl.writeFile(file.originalFilename, stream).then(function (err) {
        fs.unlink(file.path, function (err) {
            if (err) {
                console.error(err);
            }
        });
        var target = "https://s3.amazonaws.com/" + s3fsImpl.getPath(file.originalFilename);
        res.send({ link: target });
        //  res.status(200).end();
    });


});

router.get('/countries', function (req, res, next) {
    model.country.findAll().then(function (users) {
        res.json(users);
    })
});

router.get('/activities', function (req, res, next) {
    model.incident.findOne({
        where: { id: req.query.incidentId },
        attributes: ['id', 'name'],
        include: [{
            model: model.action_plan,
            attributes: ['id', 'name', 'description', 'plandate', 'categoryId', 'scenario'],
            include: [{
                model: model.incident_plan,
                where: { incidentId: req.query.incidentId },
                attributes: ['id', 'plan_activated', 'activity_status']
            }]
        }]
    }).then(function (incident) {
        if (incident) {
            if (incident.action_plan) {
                res.send(incident);
            } else {
                res.status(500);
                res.json({
                    "error": true,
                    "message": 'No Action Plan linked to the incident.'
                });
            }
        } else {
            res.status(500);
            res.json({
                "error": true,
                "message": 'Incident not found.'
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

router.post('/getOrganizationUsers', function (req, res) {
    var organization = req.body;
    var query = organization.group === 'Internal Organizations' ? { userAccountId: organization.id, userType: null , isDeleted:false } : { organizationId: organization.id, userType: 'External' };
    model.user.findAll({
        where: query,
        attributes: ['id', 'firstName', 'lastName', 'userType', 'organizationId', 'userAccountId','email','mobilePhone','userCountry'],
        order: [['firstName', 'ASC']]
    }).then(function (users) {
        res.send(users);
    });
});

function saveFile(oldPath, newPath, type, target, res) {
    var source = fs.createReadStream(oldPath);
    var dest = fs.createWriteStream(newPath);
    source.pipe(dest);
    source.on('end', function () {
        console.log("Success")
        res.send({ path: target, type: type });
    });
    source.on('error', function (err) {
        res.send(err);
    });
}


module.exports = router;
