// Lib
var async = require("async");

// Deps
var models = require("../models/");
var lib = require("../lib/");
var errors = require("../lib/errors");
var log = require("../lib/xlog");

var modulename = "r.messages";


var listChannels = function(req,res){
    var limit = parseInt(req.query.count) || 100,
        start = parseInt(req.query.start) || 0,
        order = { lastmessageat : -1, createdAt : -1};

    var q = { $and : [ { messages_count : { $gte : 0 } }] };
    
    if(req.body.members && req.body.members.length){
        q.$and.push({ members : req.body.members});
    }
    
    if(req.session.user.role !== roles.admin){
        q.$and.push({ $members : req.session.user._id});
    }
    models.Channel.countDocuments(q,function(err,count){
        models.Channel.find(q).populate("members").skip(start).limit(limit).sort(order).exec(function(err,list){
            if(err){
                lib.log.error(modulename,err);
                return res.json({ok : false, error : lib.errors.dberror});
            }
            res.json({ok : !err, data : list, total : count });
        }); 
    });
};

var getChannel = function(req,res){
    models.Channel.find({ sid : req.params.channelsid}).populate("members").exec(function(err,channel){
        if(err){
            lib.log.error(modulename,err);
            return res.json({ok : false, error : lib.errors.dberror});
        }
        res.json({ok : !err, data : channel});
    }); 
};

var listMessages = function(req,res){
    var limit = parseInt(req.query.count) || 100,
        start = parseInt(req.query.start) || 0,
        order = req.query.order || "-messageAt";

    var q = { $and : [ { to : req.params.channelsid }, { attributes : {$not : /isDeleted":true/ } }] };
    
    models.Message.countDocuments(q,function(err,count){
        models.Message.find(q).populate("user").skip(start).limit(limit).sort(order).exec(function(err,list){
            if(err){
                lib.log.error(modulename,err);
                return res.json({ok : false, error : lib.errors.dberror});
            }
            res.json({ok : !err, data : list, total : count });
            var ids = list.map(function(m){ return m._id;});
            models.Message.updateMany({ _id : { $in : ids} }, { $set : { seen : true} },function(){});
        }); 
    });
};

var removeChannel = function(req,res){
    async.parallel([
        function(cbp){
            twiliochat.deleteChannel(req.params.channelsid,cbp);
        },
        function(cbp){
            models.Message.deleteMany({ to : req.params.channelsid },cbp);
        },
        function(cbp){
            models.Channel.deleteOne({ sid : req.params.channelsid },cbp);
        }
    ],function(err){
        return res.json({ok : !err});
    });
};

var listMediaMessages = function(req,res){
    var limit = parseInt(req.query.count) || 10,
        start = parseInt(req.query.start) || 0,
        order = "-messageAt";
    models.Channel.findOne({ sid : req.params.channelsid},function(err,channel){
        if(err || !channel){
            res.json({ok : false, error : errors.notfound});
        }else if(!channel.members || channel.members.indexOf(req.session.user._id) === -1){
            res.json({ok : false, error : errors.unauthorised});
        }else{
            var q = { $and : [ 
                    { channel_sid : channel.sid },
                    { media : { $ne : null} } ,
                    { attributes : {$not : /isDeleted":true/ } }
                ]};
            models.Message.find(q)
                .skip(start).limit(limit).sort(order)
                .exec(function(err,messages){
                res.json({ok : true, data : messages});
            });
        }
    });
};

var abuseReport = function(req,res){
    models.Abuse.findOne({ user : req.session.user._id, channelsid : req.params.channelsid, reprteduser : req.params.userid},function(err,report){
        if(!report){
            var newreport = new models.Abuse({
                user                 : req.session.user._id,
                reprteduser          : req.params.userid,
                channelsid           : req.params.channelsid,
                report               : req.body.report || ""
            });
            newreport.save(function(err){
                lib.log.error(modulename, "New abuse report by "+req.session.user.fullname+" on channel id "+req.params.channelsid);
                res.json({ok : true, data : newreport});
            });
        }else{
            report.report += "\n " + req.body.report;
            report.save(function(err){
                lib.log.error(modulename, "Updated in abuse report by "+req.session.user.fullname+" on channel id "+req.params.channelsid);
                res.json({ok : true, data : report});
            });
        }
    });
};

exports.init = function(app){
    app.post("/channels",acl.admin, listChannels );
    app.get("/channels/:channelsid",acl.admin,getChannel);
    app.delete("/channels/:channelsid",acl.admin,removeChannel);
    app.get("/channels/:channelsid/messages",acl.admin, listMessages);
    app.get("/channels/:channelsid/files",acl.user, listMediaMessages);
    
    app.get("/abusereport/:channelsid/:userid",acl.user, abuseReport);
};
