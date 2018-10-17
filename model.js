
require('dotenv').load();

var Q = require('q');
var _ = require("underscore");
var Sequelize = require('sequelize');

var DBURL = process.env.DB_URL;

module.exports.db = require('./server/models/index');




