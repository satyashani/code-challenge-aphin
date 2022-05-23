/* * ************************************************************ 
 * Date: 15 Oct, 2018
 * programmer: Shani Mahadeva <shani.mahadeva@blumatter.com>
 * Company : BluMatter Inc.
 * Javascript file mongodb.js
 * *************************************************************** */

// Conf
var config = require("../config");

// Connect
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = config.db.service+'://'+config.db.username+':'+config.db.password+'@'+config.db.host+"/"+config.db.dbname;

// Create a new MongoClient
const client = new mongoClient(url);

/**
 * Callback gets the error, db object and a callback to call when operation is done;
 * @param {Function} callback
 */
module.exports = function(callback){
    client.connect(function(err) {
        if(err){
            return callback(err);
        }
        callback(null,client.db(config.db.dbname), function(){
            client.close();
        });
    });
};