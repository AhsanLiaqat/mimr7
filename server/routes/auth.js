var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jwt-simple');
var model = require('../models');
// var socket = require('../lib/socket');
const io = require('socket.io')();
var https = require('https');
var nJwt = require('njwt');

var encodeToken = function(data){
    return jwt.encode(data, process.env.JWT_SECRET,'HS512');
};

var decodeToken = function(token){
    return jwt.decode(token, process.env.JWT_SECRET, true,'HS512');
};

router.post('/login', function(req, res, next) {
    passport.authenticate('local-signin', {session: true}, function(err, user, info) {
        if (err) {
            // next(err);
            return res.status(400).json({success: false});
        }
        if (user.isDeleted ==  true) {
            // next(err);
            return res.status(400).json({success: false});
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            user.available = true;
            // var auth_token = encodeToken({id: user.id, date: new Date()});
            var expires_here = Math.floor( (Date.now() / 1000) + 60 * 60 * 4 );
            var new_jwt = nJwt.create({id: user.id},process.env.JWT_SECRET);
            new_jwt.body.exp = expires_here;
            var auth_token = new_jwt.compact();
            var data ={
                token: auth_token,
                valid_from: new Date(),
                login_detail: req.body.login_detail,
                userId: user.id
            }
            if (user.password) delete user.password;
            // model.auth_token.create(data)
            // .then(function (token) {
                model.user.update(user, { where: { id: user.id } }).then(function (result) {
                    model.user.findOne({ where: { id: user.id } }).then(function (response) {
						console.log("Login");

                        response.notifyChange();
                        user = response.dataValues;
                        return res.json({   success:true,
                            token: auth_token,
                            role: user.role,
                            name: user.firstName+' '+user.lastName,
                            email: user.email,
                            userId: user.id,
                            userAccountId: user.userAccountId });
                    });
                });
            // });
        });

    })(req, res, next);
});
router.get('/confirm-login', function(req, res, next) {
	var io = req.app.get('io');
	io.on('connection', function(socket){
		console.log('++++++++++++++++++++++++++a user connected++++++++++++++++++++++++++');
	});
    if(req.user){
        var new_jwt = nJwt.create({id: req.user.id},process.env.JWT_SECRET);
        var auth_token = new_jwt.compact();
        return res.json({   success:true,
            token: auth_token,
            role: req.user.role,
            name: req.user.firstName+' '+req.user.lastName,
            email: req.user.email,
            id: req.user.id,
            userAccountId: req.user.userAccountId });
    }else{
        res.send({});
    }

});

router.get('/logout', function(req, res){
    model.user.update({available: false}, { where: { id: req.user.id } }).then(function (result) {
        model.user.findOne({ where: { id: req.user.id } }).then(function (response) {
            response.notifyChange();
            // model.auth_token.destroy({ where: { userId: req.user.id, token: req.headers.authorization } }).then(function (response) {
                req.logout();
                res.send('true');
            // });
        });
    });

});


module.exports = router;
