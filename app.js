
var express = require('express');
var app = express();
//export it here so that other modules can use this module
var init = require('./routes/init');
var routes = require('./routes');

module.exports = app;
init.initApp(app, express);


var http = require('http');

app.get('/', routes.index);
app.post('/createuser', routes.createuser);
app.post('/createcard', routes.createupdatecard);
app.post('/sale', routes.sale);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});




