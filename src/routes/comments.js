// Lib
var async = require("async");

// Deps
var models = require("../models/");
var lib = require("../lib/");
var errors = require("../lib/errors");
var log = require("../lib/xlog");

var modulename = "r.messages";


exports.init = function(app){
    app.post("/comment", listChannels );
    app.put("/comment", listChannels );
    app.get("/comment/", getChannel);
    app.get("/comment/:commentid", getChannel);
    app.delete("/comment/:commentid", removeChannel);
};
