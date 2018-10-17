
require('dotenv').load();

var Q = require('q');
var _ = require("underscore");
var Sequelize = require('sequelize');

var DBURL = process.env.DB_URL;

var s = re();

module.exports.sequelize = sequelize = new Sequelize(DBURL, {logging: false});

module.exports.User = User = sequelize.define("users", {
    id: {type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true},
    username: Sequelize.STRING,
    password:Sequelize.STRING,
    role: Sequelize.STRING,
    lastLogin: Sequelize.DATE,
    enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports.MessageHistory = MessageHistory = sequelize.define("message_history", {
    id: {type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true},
    message: Sequelize.STRING
});
MessageHistory.belongsTo(User);
//MessageHistory.belongsTo(Message);

module.exports.LibraryReference = LibraryReference = sequelize.define("library_reference", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.STRING,
    author: Sequelize.STRING,
    description: Sequelize.STRING,
    links: Sequelize.STRING,
    filename: Sequelize.STRING,
    tags: Sequelize.STRING
});
LibraryReference.belongsTo(User);


module.exports.incidents = require('./incidents')
