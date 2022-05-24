// Deps
var models = require("../models/");
var lib = require("../lib/");
var errors = require("../lib/errors");

var modulename = "r.user";

var checkUserName = function(username,  email ,callback){
    models.User.countDocuments({ username : username, "contact.email" : { $ne : email }},callback);
};

var handlers = {
    create : function(req,res){
        var check = lib.validator.check({
            properties : {
                email : { $ref : '/email', required : true},
                firstname : { type : 'string' },
                lastname  : { type : 'string' },
                profilePictureUrl : { type : 'string' },
                username  : { type : 'string' }
            }
        },req.body);
        if(check !== true){
            return res.json(check);
        }
        var createUser = function(){
            models.User.findOne({ "contact.email" : req.body.email },function(err,user){
                if(user){
                    return res.json({ error : errors.userexists});
                }
                var u = new models.User({
                    contact : {
                        email : req.body.email,
                        firstName : req.body.firstname,
                        lastName  : req.body.lastname
                    },
                    profilePictureUrl : req.body.profilePictureUrl || '',
                    username : req.body.username || null
                });
                u.save(function(err){
                    if(err){
                        lib.log(modulename,err);
                        return res.json({error : errors.dberror});
                    }
                    res.json({ data : u});
                });
            });
        };
        if(req.body.username){
            checkUserName(req.body.username,req.body.email,function(err,count){
                if(count){
                    return res.json({ error : errors.usernameExists});
                }
                createUser();
            });
        }else{
            createUser();
        }
    },
    
    update : function(req,res){
        var check = lib.validator.check({
            properties : {
                email : { $ref : '/email', required : true},
                firstname : { type : 'string' },
                lastname  : { type : 'string' },
                profilePictureUrl : { type : 'string' },
                username  : { type : 'string' }
            }
        },req.body);
        if(check !== true){
            return res.json(check);
        }
        
        var updateUser = function(){
            models.User.findOne({ "contact.email" : req.body.email },function(err,user){
                if(err){
                    return res.json({error : errors.dberror});
                }
                if(!user){
                    return res.json({error : errors.usernotfound});
                }
                user.contact.firstName = req.body.firstname;
                user.contact.lastName  = req.body.lastname;
                user.profilePictureUrl = req.body.profilePictureUrl;
                user.username = req.body.username;
                user.save(function(err){
                    if(err){
                        lib.log.error(modulename,err);
                        return res.json({error : errors.dberror});
                    }
                    res.json({data : user});
                });
            });
        };
        
        if(req.body.username){
            checkUserName(req.body.username,req.body.email,function(err,count){
                console.log(err,count);
                if(count){
                    return res.json({ error : errors.usernameExists});
                }
                updateUser();
            });
        }else{
            updateUser();
        }
    },
    
    list : function(req,res){
        var q = {};
        if(req.query.username){
            q.username = new RegExp(".*"+req.query.username+".*","i");
        }
        var start = parseInt(req.query.start) || 0, limit = parseInt(req.query.limit) || 10;
        var sort =  req.query.sort || "-createdAt";
        models.User.countDocuments(q,function(err,count){
            if(!count){
                return res.json({ data : []});
            }
            models.User.find(q)
                    .limit(limit).skip(start).sort(sort)
                    .exec(function(err,users){
                if(err){
                    lib.log.error(modulename,err);
                    return res.json({ error : errors.dberror});
                }
                res.json({ data : users, total : count});
            });
        });
    },
    
    get : function(req,res){
        models.User.findOne({ _id : req.params.userid},function(err,user){
            if(err){
                return res.json({ error : errors.dberror});
            }
            if(!user){
                return res.json({ error : errors.usernotfound});
            }
            res.json({ data : user});
        });
    },
    
    remove : function(req,res){
        models.User.deleteOne({ _id : req.params.userid},function(err,count){
            if(err){
                return res.json({ error : errors.dberror});
            }
            if(!count){
                return res.json({ error : errors.usernotfound});
            }
            res.json({ data : count});
        });
    }
};

exports.init = function(app){
    app.post("/user",handlers.create);  
    app.put("/user",handlers.update);
    app.get("/user",handlers.list);
    app.get("/user/:userid",handlers.get);
    app.delete("/user/:userid",handlers.remove);
};

