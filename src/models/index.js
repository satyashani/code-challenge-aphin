// Lib
const EventEmitter = require('events');

// Conf
var config = require("../config");
var xlog = require("../lib/xlog");

// This is loaded to enstablish connection before creating models
var mongoose = require("./mongoose");
    
var modulename = 'models';

var modelNames = ["Comment", "User"];

var models = {};

modelNames.forEach(function(m){
    models[m] = require("./"+m);
});

class ModelsConnector extends EventEmitter {
    constructor(){
        super();
        modelNames.forEach(function(m){
            this[m] = models[m].model;
        });
    }
    
    connect(cb){
        mongoose.connect(config.db.service+'://'+config.db.username+':'+config.db.password+'@'+config.db.host+"/"+config.db.dbname,{ useNewUrlParser: true },function(err){
            if(err){
                xlog.error(modulename,"Error connecting to db "+ err.message);
                process.exit();
            }else{
                xlog.info(modulename,"Connected to db");
                cb();
            }
        });
    }
};

var models = new ModelsConnector();
models.connect(function(){
    models.emit('connect');
});
module.exports = models;

