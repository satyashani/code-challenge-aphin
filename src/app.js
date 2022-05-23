/* * ************************************************************ 
 * Date: 2 Sep, 2018
 * programmer: Shani Mahadeva <shani.mahadeva@blumatter.com>
 * Company : BluMatter Inc.
 * Javascript file ap.js
 * *************************************************************** */


var modulename = 'Main';

// Lib
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var async = require("async");
var http = require('http');


// Config
var config = require("./config");

// Deps
var mongoose = require("./models/mongoose");
var routes = require("./routes/");
var models = require("./models/");
var lib = require("./lib/");
 
// App Setup
var app = express();
app.enable('strict routing');

// Post data parsing
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Compression
app.use(require('compression')({threshold: 2048}));

// Request Logging
app.use(require('morgan')(
    function (tokens, req, res) {
        return [
            new Date().toISOString(),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            "'IP",
            tokens['remote-addr'](req,res),
            "GOT",
            tokens.res(req, res, 'content-length'), 
            "bytes IN",
            tokens['response-time'](req, res)+"ms'"
        ].join(' ');
    },{
        skip : function(req,res){  return req.url.match(/^\/(js|css|html|img|font|me$|notifications|files|config|public)/); }
    })
);

lib.log.action("APP","Connecting to database..");

models.on('connect', function() { 
    lib.log.info("APP","Connected to database, now starting app");
    
    models.saveStatic();
    routes.init(app);
});

// Crash event handling
process.on('unhandledRejection', (reason, p) => { 
    lib.log.error("APP",reason);
});

process.on('uncaughtException', (err) => { 
    lib.log.error("APP",err);
});
