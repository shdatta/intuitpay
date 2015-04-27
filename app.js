//Initial check in
var express = require('express');
var app = express();
//export it here so that other modules can use this module
var init = require('./routes/init');
var routes = require('./routes');

module.exports = app;
init.initApp(app, express);


var http = require('http');

app.get('/', routes.index);

//{
//	"phone_number" 	: 	"8182884344",
//	"username"		: 	"Some Name",
//	"email"			:	"email",
//	"password"		:	"password",
//	"pin"			:	"pin"
//}
app.post('/createuser', routes.createuser);

//{
//    "card_number": "4111111111111111",
//    "cvc": "1234",
//    "expiry": "04/2019",
//    "id": "-1",
//    "name": "Test User",
//    "nick_name": "VISA2",
//    "phone_number": "8182884341"
//}
app.post('/createcard', routes.createupdatecard);

//{
//	"phone_number" 	: 	"8182884341",
//	"id"			:	"cdc9800d-a89d-4bc1-be9b-feabdd1915d3",
//	"amount"		:	"10.00",
//	"intuitId"		:	"intuitId"
//}
app.post('/sale', routes.sale);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});




