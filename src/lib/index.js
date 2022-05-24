/* * ************************************************************ 
 * Date: 3 Sep, 2018
 * programmer: Shani Mahadeva <shani.mahadeva@blumatter.com>
 * Company : BluMatter Inc.
 * Javascript file index.js
 * *************************************************************** */


module.exports = {
    errors : require("./errors"),
    log : require("./xlog"),
    noop : function(){},
    validator : require("./jsonSchemaValidator")
};
