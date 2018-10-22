var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var http = require('http');
var pg = require('pg');
var ConnectPg = require('connect-pg-simple');
var cookieSession = require('cookie-session');
var pgSession = ConnectPg(session);
var app = express();
var jwt = require('jwt-simple');
var router = express.Router();
var nJwt = require('njwt');
require('dotenv').load()

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static('client'));
app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade')

app.use(express.static(path.join(__dirname, 'public/app/')));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));

app.cookieParser = cookieParser('abcdefg')
app.use(app.cookieParser);

app.sessionParser = cookieSession({
    name: 'auth-tkt',
    keys: ['key1', 'key2'],
    cookie: {
        maxAge: 60 * 60 * 1000
    }
})
app.use(app.sessionParser);
app.use(passport.initialize());
app.use(passport.session());
var models = require('./models');
require('./local-strategy')(passport);
app.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    // req.headers && (req.url.indexOf('/auth/login') !== -1 || ( req.headers['upper-url'] && (req.headers['upper-url'] == '/pages/simulationLogin' || (req.headers['upper-url'] == '/pages/signin' && req.url.indexOf('/auth/confirm-login') == -1 ) )))
    if(req.url.indexOf('/users/editorImage') !== -1 || (req.headers && (req.url.indexOf('/auth/login') !== -1 || ( req.headers['upper-url'] && (req.headers['upper-url'] == '/pages/simulationLogin' || (req.headers['upper-url'] == '/pages/signin' && req.url.indexOf('/auth/confirm-login') == -1 ) ))))){
        next();
    }
    else if(req.url.indexOf('.map') == -1 ){
        var token = req.headers.authorization || req.query.token || req.headers['x-access-token'];
        if (token) {
            nJwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
              if (err) {
                req.logout();
                return res.status(380).send('Authorization Expired, logging you out!');
              } else {
                // if everything is good, save to request for use in other routes
                // req.decoded = decoded;
                req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
                next();
                }
            });
        } else {
            // req.logout();
            // delete req.session;
            return res.status(380).send('Non Authenticated User, logging you out.');
        }
    }else{
        next();
    }
});

// app.get('/*', function (req, res, next) {
//     if(req.url.indexOf('.map') < 0)
//     // console.log('------------------>>>>>',req.headers.authorization);
//     if(req.headers.authorization){
//         nJwt.verify(req.headers.authorization,process.env.JWT_SECRET,function(err,verifiedJwt){
//           if(err){
//             req.logout();
//             console.log('--------------------',req.url,'----------a');
//             res.status(380).send('Authorization Expired, logging you out!');
//           }else{
//             // if(req.user && verifiedJwt.body.id == req.user.id){
//                 next();
//             // }else{
//             //     req.logout();
//             //     console.log('--------------------',req.url,'----------b');
//             //     res.status(380).send('Invalid Authorization Provided, logging you out.');
//             // }
//           }
//         });
//     }else{
//         req.logout();
//         console.log('--------------------',req.url,'----------c');
//         res.status(380).send('Non Authenticated User, logging you out.');
//     }
//     else{
//         next();
//     }

// });
//=====================General API=================================
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));

//=====================Crisis Manager API=================================

// app.use('/messages', require('./routes/crisis-manager/message'));
// app.use('/message-history', require('./routes/crisis-manager/message-history'));
// app.use('/api/incidents', require('./routes/crisis-manager/incidents'));
// app.use('/mail', require('./routes/crisis-manager/mail'));
// app.use('/email-track', require('./routes/crisis-manager/email-tracking'));
// app.use('/dynamic-form', require('./routes/crisis-manager/dynamic-form'));
// app.use('/api/map-images', require('./routes/crisis-manager/map-images'));
// app.use('/form-types', require('./routes/crisis-manager/form-type'));
// app.use('/dynamic-form-data', require('./routes/crisis-manager/dynamic-form-data'));

//=====================Settings API=================================

// app.use('/settings/all-categories', require('./routes/settings/all-categories.js'));
// app.use('/settings/custom-messages', require('./routes/settings/custom-messages.js'));
// app.use('/settings/locations', require('./routes/settings/locations.js'));
// app.use('/settings/incident-types', require('./routes/settings/incident-types.js'));
// app.use('/settings/roles', require('./routes/settings/roles.js'));
// app.use('/settings/organizations', require('./routes/settings/organizations.js'));
// app.use('/settings/departments', require('./routes/settings/departments.js'));
// app.use('/settings/dashboard-categories', require('./routes/settings/dashboard-categories.js'));
// app.use('/settings/accounts', require('./routes/settings/accounts.js'));
// app.use('/settings/incident-teams', require('./routes/settings/incident-teams.js'));

//=====================Mobile API=================================
// app.use('/api/mobile/task', require('./routes/mobile/taskList.js'));
// app.use('/api/mobile/incident', require('./routes/mobile/incident.js'));
// app.use('/api/mobile/messages', require('./routes/mobile/messages.js'));
// app.use('/api/mobile/activity', require('./routes/mobile/activities.js'));
// app.use('/api/mobile/users', require('./routes/mobile/users.js'));
// app.use('/api/mobile/device', require('./routes/mobile/device.js'));
// app.use('/api/mobile/categories', require('./routes/mobile/categories.js'));
// app.use('/api/mobile/incidentPlan', require('./routes/mobile/incidentPlan.js'));
// app.use('/api/mobile/incidentActivities', require('./routes/mobile/incidentActivities.js'));
// app.use('/api/mobile/reference-libraries', require('./routes/mobile/reference-libraries.js'));
// app.use('/api/Sms', require('./routes/sms.js'));
// app.use('/api/ios', require('./routes/iosPush.js'));

//======================Simulation Routes=========================================
// app.use('/simulation/id-games', require('./routes/simulation/id-games.js'));
// app.use('/simulation/id-game-messages', require('./routes/simulation/id-game-messages.js'));
// app.use('/simulation/id-schedule-games', require('./routes/simulation/id-schedule-games.js'));
// app.use('/simulation/id-schedule-messages', require('./routes/simulation/id-schedule-messages.js'));

// app.use('/simulation/game-players', require('./routes/simulation/game-players.js'));
// app.use('/simulation/game-player-lists', require('./routes/simulation/game-player-lists.js'));

// app.use('/simulation/game-roles', require('./routes/simulation/game-roles.js'));
// app.use('/simulation/game-libraries', require('./routes/simulation/game-libraries.js'));
// app.use('/simulation/game-categories', require('./routes/simulation/game-categories.js'));
// app.use('/simulation/game-messages', require('./routes/simulation/game-messages.js'));
// app.use('/simulation/game-assign-messages', require('./routes/simulation/game-assign-messages.js'));
// app.use('/simulation/game-rounds',require('./routes/simulation/game-rounds.js'));
// app.use('/simulation/game-teams', require('./routes/simulation/game-teams.js'));
// app.use('/simulation/read-messages', require('./routes/simulation/read-messages.js'));
// app.use('/simulation/archive-messages', require('./routes/simulation/archive-messages.js'));
// app.use('/simulation/message-responses', require('./routes/simulation/message-responses.js'));

// app.use('/simulation/games', require('./routes/simulation/games.js'));
// app.use('/simulation/game-plan-messages', require('./routes/simulation/game-plan-messages.js'));
// app.use('/simulation/schedule-games', require('./routes/simulation/schedule-games.js'));
app.use('/articles', require('./routes/articles.js'));
app.use('/article-libraries', require('./routes/article-libraries.js'));
app.use('/messages', require('./routes/messages.js'));


app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', {
        root: path.join(__dirname, '../client/')
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace


//// DB hits cache code -- please uncoment to get it work.




if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err.message);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
