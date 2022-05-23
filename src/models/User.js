/* * ************************************************************ 
 * Date: 30 Aug, 2018
 * programmer: Shani Mahadeva <shani.mahadeva@blumatter.com>
 * Company : BluMatter Inc.
 * Javascript file User.js
 * *************************************************************** */

var mongoose = require("./mongoose");
var Schema = mongoose.Schema;

const User = new Schema({
    contact : {
        firstName : String,
        lastName  : String,
        email     : String
    },
    profilePictureUrl : String,
    username : String
},{ timestamps : true });

User.index({ "contact.firstName" : 1});
User.index({ "contact.lastName"  : 1});
User.index({ "username"          : 1}, { unique : true });

exports.schema = User;
exports.model = mongoose.model("User",User);