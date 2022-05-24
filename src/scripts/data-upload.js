/* * ************************************************************ 
 * Date: 24-May-2022
 * programmer: Shani Mahadeva <satyashani@gmail.com>
 * Javascript file data-upload.js
 * *************************************************************** */


var fs = require("fs");
var async = require("async");

var models = require("../models/");

var maps = {
    User : function(input){
        return {
            contact : {
                firstName : input.contact.firstName,
                lastName  : input.contact.lastName,
                email     : input.contact.email
            },
            id : input.id,
            profilePictureUrl : input.profilePictureUrl,
            username : input.username
        };
    },
    Comment : function(input){
        return {
            hashTags    : input.hashTags,
            mentions    : input.mentions,
            text        : input.text,
            timestamp   : new Date(input.timestamp),
            uid         : input.userId
        };
    }
};

var uploader = function(sourcefile,modelname,callback){
    fs.exists(sourcefile,function(exists){
        if(!exists){
            return callback(new Error("File not found"));
        }
        fs.readFile(sourcefile,function(err,dataRaw){
            var data = null;
            try{
                data = JSON.parse(dataRaw);
            }catch(e){
                return callback(e);
            }
            async.each(data,function(d,cb){
                var dn = new models[modelname](maps[modelname](d));
                dn.save(cb);
            },callback);
        });
    });
};

var uidMap = function(callback){
    var found = 0;
    models.Comment.find({},function(err,comments){
        async.each(comments,function(comment,cb){
            models.User.findOne({ id : comment.uid},function(err,user){
                if(!user){
                    return cb();
                }
                found++;
                comment.userId = user._id;
                comment.save(cb);
            });
        },function(err){
            callback(err,found);
        });
    });
};

exports.upload = uploader;
exports.uidmap = uidMap;