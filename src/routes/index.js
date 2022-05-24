
// Lib
var http = require("http");

// Deps
var conf = require("../config");
var package = require("../package");
var xlog = require("../lib/xlog");
var errors = require("../lib/errors");

var modulename = 'route.index';

var routeNames = ["user","comments","analytics"];

var routes = {};

routeNames.forEach(function(r){
    routes[r] = require("./"+r);
});

var serverTest = function(req,res){
    if(req.query.test === 'error'){
        xlog.error(modulename,'this is a test error');
        res.json({ok : false, error : errors.notfound});
    }else if(req.query.test === 'crash'){
        throw new Error("This is a crash test");
    }else{
        res.json({ok : true, data : package.version});
    }
};

var addRoutes = function(app){
    app.get("/test",serverTest);
};

exports.init = function(app){
    addRoutes(app);
    
    for(var i in routes){
        if(typeof routes[i].init === "function")
        routes[i].init(app);
    }
    app.use(function(err,req,res,next){
        xlog.error(modulename,err.message,"\n    Request : "+req.method,req.url,
        "\n    Req Params : "+JSON.stringify(req.params),"\n    Req body : "+JSON.stringify(req.body)
        ,"\n    Stacktrace : "+err.stack);
        
        if (res.headersSent) {
            return next(err);
        }
        res.json({ error : errors.generalError });
    });
    
    http.createServer(app).listen(conf.app.port, conf.app.host, function(){
        xlog.info(modulename,'Express server listening on port ' + conf.app.port);
    });
};


