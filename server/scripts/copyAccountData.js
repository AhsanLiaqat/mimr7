CH= {wss: {}};

var express = require('express');
var router = express.Router();
let model = require('../models');
var _ = require('underscore');

const Pool = require('pg-pool');

const readPool = new Pool({
    host: 'localhost',
    database: 'crisishub1',
    user: 'postgres',
    password: 'postgres',
    port: 5432
});

const writePool = new Pool({
    host: 'localhost',
    database: 'crisishub',
    user: 'postgres',
    password: 'postgres',
    port: 5432
});

const pgCopy = require('pg-copy-streams');
const copyTo = pgCopy.to;
const copyFrom = pgCopy.from;

readPool.connect(function(readErr, readClient, readDone) {


    writePool.connect(function(writeErr, writeClient, writeDone) {
        const readStream = readClient.query(copyTo('COPY (SELECT "name" from roles) TO STDOUT'));


        const writeStream = writeClient.query(copyFrom('COPY roles FROM STDIN'));

         readStream.on('error', function (err) {
            console.log(err);
            console.log("brooooo")
            writeDone(err);
            readDone(err);
        });
        writeStream.on('error', function (err) {
            console.log(err);
            writeDone(err);
            readDone(err);
        });
        readStream.pipe(writeStream);

        readStream.on('end', function () {
            writeDone();
            readDone();
            console.log("endndndnd")
        });

    });
});


console.log("the end");
