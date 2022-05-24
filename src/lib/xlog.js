/* * ************************************************************ 
 * Date: 12 Aug, 2016
 * programmer: Shani Mahadeva <shani.mahadeva@blumatter.com>
 * Company : BluMatter Inc.
 * Javascript file xlog.js
 * *************************************************************** */

var conf = require("../config");

var logTypes = {
    'error' : 0, 'warning' : 1, 'notice' : 2, 'action' : 3 , 'info' : 4, debug : 5
};

var logLevelIndex = ['error', 'warning', 'notice', 'action' , 'info', "debug"];

var logTexts = {
    'error' : "ERROR", 'warning' : "WARNING", 'notice' : "NOTICE", 'action' : "ACTION" , 'info' : 'INFO', debug : "DEBUG"
};

var logLevel = conf.logging.logLevel && logTypes.hasOwnProperty(conf.logging.logLevel) ?
                logTypes[conf.logging.logLevel] : logTypes.info;

var modulename = "Logger";

var consoleLog = function(type,opname,log){
    var d = new Date();
    if(type !== 'error'){
        console.log(d.toISOString(),logTexts[type],opname,'"'+log+'"');
    }else{
        console.error(d.toISOString(),logTexts[type],opname,'"'+log+'"');
    }
};

var joinArgs = function(argv,starting){
    var t = '', i = starting || 0;
    for(i;i<argv.length;i++)
        t += " "+argv[i].toString();
    return t;
};

var xlog = {
    requestLog : function(action,req){
        if(req.session && req.session.user){
            var log = req.method+" "+req.url + ", BODY:"+JSON.stringify(req.body);
            xlog.action("UserRequest",req.session.user.id,action,log);
        }
    },
    /**
     * 
     * @param {String} opname
     * @param {Error | String} err
     * @param {String} message
     * @param {Boolean} logstack
     */
    error : function(opname,err,message,logstack){
        var e = err && err.message ? err.message : err;
        e +=  message || "";
        e += logstack && err && err.stack ? err.stack : "";
        
    },
    /**
     * 
     * @param {String} opname
     */
    warning : function(opname){
        if(logLevel >= logTypes.warning)
            consoleLog('warning', opname,joinArgs(arguments,1));
    },
    /**
     * 
     * @param {String} opname
     */
    action : function(opname){
        if(logLevel >= logTypes.action)
            consoleLog('action', opname,joinArgs(arguments,1));

    },
    /**
     * 
     * @param {String} opname
     */
    info : function(opname){
        if(logLevel >= logTypes.info)
            consoleLog('info', opname,joinArgs(arguments,1));
    },
    /**
     * 
     * @param {String} opname
     */
    debug : function(opname){
        if(logLevel >= logTypes.debug)
            consoleLog('debug', opname,joinArgs(arguments,1));
    }
};

module.exports = xlog;

xlog.info(modulename,"Log level:",logLevel,':',logLevelIndex[logLevel]);
