var cassandra = require('cassandra-driver');
var path = require('path');
var uuid = require('node-uuid');
var config = require('./logOptions');
var log4js = require('log4js');
log4js.configure(config);
log4js.replaceConsole();
var logger = log4js.getLogger( "all" );

var init = function(){
	
    var logMe = function(req, message){
        logger.debug('[RequestId:' + req.RequestId + ']' + message);
    }

	function beginRoute(req, res, next) {
		req.RequestId = uuid.v4();
        req.logme = logMe;
	    req.logme(req, JSON.stringify(req.body));
		req.next = next;
        req.res = res;
	    next(); // Passing the request to the next handler in the stack.
	};

	function endRoute(req, res, next) {
//	    req.logger.debug(JSON.stringify(res.body));
        req.logme(req, JSON.stringify(res.body));
        res.setHeader("Content-Type", "text/json");
        res.send(res.body);
	};


	this.initApp = function(app, express){
		app.set('port', process.env.PORT || 3000);
		app.set('views', path.join(__dirname, 'views'));
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.methodOverride());
		// app.use(app.router);
		app.use(express.static(path.join(__dirname, 'public')));
		app.configure(function(){
			app.use(beginRoute);
			app.use(app.router);
			app.use(endRoute);
		});

		var client = new cassandra.Client({ contactPoints: ['localhost']});
		app.set('cassandra', client);
		app.set('uuid', uuid);
		if ('development' == app.get('env')) { app.use(express.errorHandler());}
	 };
};

module.exports = new init();

