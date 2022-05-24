var async = require("async");

// Deps
var models = require("../models/");
var lib = require("../lib/");
var errors = require("../lib/errors");
var log = require("../lib/xlog");

var modulename = "r.analytics";


var handlers = {
    topcomment : function(req,res){
        var start = req.query.start || 0, limit = req.query.limit || 10, skip = req.query.skip || 0;
        var sort =  req.query.sort || "-createdAt";
        
        var metric = req.body.metric;
        
        var pipeline = [
            { $unwind : { path : "$"+metric} },
            { $project : { metric : "$"+metric} },
            { $group: { _id  :  "$metric" , count : {$sum: 1} } }
        ];
        if(req.query.search){
            pipeline.push({ $match : { "_id" : new RegExp(req.query.search,"i") } });
        }
        models.Comment.aggregate(pipeline).count("count").exec(function(err,countDoc){
            if(!countDoc || countDoc.length){
                return res.json({ data : [] });
            }
            pipeline.push({ $sort : sort });
            pipeline.push({ $skip : start});
            pipeline.push({ $limit : limit});
            models.User.aggregate(pipeline,function(err,data){
                err && lib.log.error(modulename,err);
                res.json({data : data, total : countDoc && countDoc.length ? countDoc[0].count : 0});
            }); 
        });
    }
};

exports.init = function(app){
    app.get("/analytics/:metric(hashTags|mentions)", handlers.topcomment );
};
