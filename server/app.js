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
    if( req.url.indexOf('/users/editorImage') !== -1 || 
        (req.headers && 
        (req.url.indexOf('/auth/login') !== -1 || 
        ( req.headers['upper-url'] && 
        (req.headers['upper-url'].indexOf('/pages/content-questions') !== -1 || 
        (req.headers['upper-url'].indexOf('/pages/studentLogin') !== -1 || 
        (req.headers['upper-url'] == '/pages/signin' && req.url.indexOf('/auth/confirm-login') == -1 ) )))))){
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

//=====================General API=================================
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));

app.use('/settings/locations', require('./routes/settings/locations.js'));
app.use('/chapters', require('./routes/chapter.js'));
app.use('/settings/organizations', require('./routes/settings/organizations.js'));
app.use('/settings/students', require('./routes/settings/students.js'));
app.use('/settings/player-lists', require('./routes/settings/player-list.js'));
app.use('/content-plan-templates', require('./routes/content-plan-template.js'));
app.use('/question-scheduling', require('./routes/question-scheduling.js'));
app.use('/settings/accounts', require('./routes/settings/accounts.js'));
app.use('/articles', require('./routes/articles.js'));
app.use('/article-libraries', require('./routes/article-libraries.js'));
app.use('/messages', require('./routes/messages.js'));
app.use('/responses', require('./routes/responses.js'));
app.use('/questions', require('./routes/question.js'));
app.use('/content-questions', require('./routes/content-questions.js'));
app.use('/dynamic-form', require('./routes/dynamic-form.js'));




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
