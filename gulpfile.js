// var gulp = require('gulp');
// var nodemon = require('gulp-nodemon');



// gulp.task('server', function() {
//     // configure nodemon
//     nodemon({
//         script: 'index.js',
//         watch: ["*"],
//         ext: 'js'
//     }).on('restart', function() {
//         gulp.src('index.js');
//     });
// });

var gulp = require('gulp');
// var nodemon = require('gulp-nodemon');
var notify = require('node-notify');
var query = require('pg-query')

gulp.task('default', function() {
    // var sources = ['./public/index.html']
    // return gulp.src('./public/index.html')
    //     .pipe(inject(gulp.src(sources), {relative: true}))
    //     .pipe(gulp.dest('./client'))
    // place code for your default task here
});

gulp.task('bootstrap-db', function() {
    var models = require('./model') ;
    var promise = models.db.sequelize.sync({force: true});
    promise.then(function(){

        models.db.users.create({username: "admin", password: "crisishub123", firstName: "admin", lastName: 'user', role:'superadmin', email: "admin@crisishub.co"});
    })
});

gulp.task('bootstrap', function() {
    var models = require('./model') ;
    var promise = models.db.sequelize.sync();
    promise.then(function(){
    });
});


gulp.task('server', function() {
    // configure nodemon
    nodemon({
        script: 'bin/www',
        watch: ["server/*"],
        ext: 'js'
    }).on('restart', function() {
        gulp.src('bin/www');
    });
});


