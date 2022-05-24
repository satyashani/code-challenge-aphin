// Deps
var models = require("../models/");
var lib = require("../lib/");
var errors = require("../lib/errors");
var log = require("../lib/xlog");

var modulename = "r.comments";


var handlers = {
    create : function(req,res){
        var check = lib.validator.check({
            properties : {
                hashtags  : { type : "array" ,  items:  { type : 'string' } },
                mentions  : { type : "array" ,  items:  { type : 'string' } },
                text      : { type : 'string' },
                user      : { type : 'string' }
            }
        },req.body);
        if(check !== true){
            return res.json(check);
        }
        
        var comment = new models.Comment({
            hashTags    : req.body.hashtags || [],
            mentions    : req.body.mentions || [],
            text        : req.body.text || '',
            timestamp   : new Date().getTime(),
            userId      : req.body.user
        });
        comment.save(function(err){
            if(err){
                log.error(modulename,err);
                return res.json({ error : errors.dberror});
            }
            res.json({ data : comment});
        });
    },
    
    update : function(req,res){
        var check = lib.validator.check({
            properties : {
                _id       : { type : 'string', required  : true },
                hashtags  : { type : "array" ,  items:  { type : 'string' } },
                mentions  : { type : "array" ,  items:  { type : 'string' } },
                text      : { type : 'string' },
                user      : { type : 'string' }
            }
        },req.body);
        if(check !== true){
            return res.json(check);
        }
        
        models.Comment.findOne({ _id : req.body._id},function(err,comment){
            if(err){
                log.error(modulename,err);
                return res.json({ error : errors.dberror});
            }
            if(!comment){
                return res.json({ error : errors.commentNotFound});
            }
            comment.hashTags = req.body.hashtags;
            comment.mentions = req.body.mentions;
            comment.text = req.body.text;
            
            comment.save(function(err){
                if(err){
                    log.error(modulename,err);
                    return res.json({ error : errors.dberror});
                }
                res.json({ data : comment});
            });
        });
    },
    
    list : function(req,res){
        var q = {};
        if(req.query.userid){
            q.userId = req.query.userid;
        }
        var start = parseInt(req.query.start) || 0, limit = parseInt(req.query.limit) || 10;
        var sort =  req.query.sort || "-createdAt";
        models.Comment.countDocuments(q,function(err,count){
            if(!count){
                return res.json({ data : []});
            }
            models.Comment.find(q)
                .limit(limit).skip(start).sort(sort)
                .populate("userId")
                .exec(function(err,comments){
               if(err){
                    lib.log.error(modulename,err);
                    return res.json({ error : errors.dberror});
                }
                res.json({ data : comments, total : count});     
            });
        });
    },
    
    get : function(req,res){
        models.Comment.findOne({ _id : req.params.commentid})
            .populate("userId")
            .exec(function(err,comment){
            if(err){
                lib.log.error(modulename,err);
                return res.json({ error : errors.dberror});
            }
            res.json({ data : comment});
        });
    },
    
    remove : function(req,res){
        models.Comment.deleteOne({ _id : req.params.commentid},function(err,count){
            if(err){
                lib.log.error(modulename,err);
                return res.json({ error : errors.dberror});
            }
            res.json({ data : count});
        });
    }
};

exports.init = function(app){
    app.post("/comment", handlers.create );
    app.put("/comment", handlers.update );
    app.get("/comment", handlers.list);
    app.get("/comment/:commentid", handlers.get);
    app.delete("/comment/:commentid", handlers.remove);
};
