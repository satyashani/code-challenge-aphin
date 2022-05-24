
// Lib
var mongoose = require('mongoose');

// Conf
var config = require("../config");
var xlog = require("../lib/xlog");

var modulename = 'm.mongoose';

// Connect
mongoose.set('bufferCommands', config.db.bufferCommands || false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.db.service+'://'+config.db.username+':'+config.db.password+'@'+config.db.host+"/"+config.db.dbname,{ useNewUrlParser: true },function(err){
    if(err){
        xlog.debug(modulename,"Error connecting to db",err.message);
    }else{
        xlog.info(modulename,"Connected to db");
    }
});

module.exports = mongoose;