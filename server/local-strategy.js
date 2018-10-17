var LocalStrategy   = require('passport-local').Strategy;
var models = require('./models/');
var Sequelize = require("sequelize");

var DBURL = process.env.DB_URL;

var sequelize = new Sequelize(DBURL, {logging: false});

module.exports = function(passport) {

    passport.use('local-signin', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        session: true,
        passReqToCallback : false
    },
    function(email, password, done) {
        models.user.findOne({where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), sequelize.fn('lower', email))}).then(function(user){
            if (user){
                var authPromise = user.authenticate(password);
                authPromise.then(
                    function (res){
                        if(res || password == user.password){
                        	user.lastLogin = new Date();
                            user.save();
                            done(null, user.dataValues);
                        }else{
                            done(true, user.dataValues)
                        }
                    }
                )
            } else {
                done("User doesn't exist")
            }
        }).catch(function(err){
            done(err);
        })

    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });


};
