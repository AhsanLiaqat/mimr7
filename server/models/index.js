require('dotenv').load()

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");

var re = new RegExp("^((?!index).)*.js$");
// Used to test if a file in the models directory is a js file other than index.js

var DBURL = process.env.DB_URL;

var sequelize = new Sequelize(DBURL, {logging: false, define: {freezeTableName:true}});
var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && re.test(file);
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
