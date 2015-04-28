var cryptography = require('./cryptography');
var http = require('https');
var config = require('./config');
var twilio = require('twilio')(config.twilioApi.accountSid, config.twilioApi.authToken);
var email = require('./paymentsEmail')

var payments = function(){
    
    var text = function(charge, body, number) {
        twilio.messages.create({ 
            to: number, 
            from: config.twilioApi.from, 
			body: '\nPayment from:' + charge.card.name + '\nAmount:' + charge.amount,   
        }, function(err, message) { 
            console.log(err); 
        });
    };

	this.sale = function(request, merchDetails, charge){
		var headers = {
			'Request-Id': request.RequestId,
		    'Content-Type': config.jsonContentType,
		    'Authorization': config.paymentsAPI.authorization,
		    'Company-Id': merchDetails.merchantId
		};

		var options = {
			host: config.paymentsAPI.host,
  			port: config.paymentsAPI.port,
  			path: config.paymentsAPI.path,
  			method: config.httpMethods.post,
  			headers: headers
		};
		var userString = JSON.stringify(charge);

		var req = http.request(options, function(res) {
  			res.setEncoding(config.utf8);
  			var responseString = '';
			res.on('data', function(data) {
    			responseString += data;
  			});

  			res.on('end', function() {
                var body = JSON.parse(responseString);
                body.RequestId = request.RequestId;
                body.cardname = charge.name;
                body.merchant = merchDetails.name
                request.res.body = body;
                request.next();
                text(charge, body,  merchDetails.phone);
                email.email(request, merchDetails, charge);
  			});
		});

		req.on('error', function(e) {
			request.next(e);
		});

		req.write(userString);
		req.end();
	}

	this.getCharge = function(merchantDetails, cardDetails, salt){
		var charge = new Object();
		charge.amount = merchantDetails.amount;
		charge.capture = true;
		charge.currency = 'USD';
		var card = new Object();
		card.name = cardDetails.name;
		card.number = cryptography.decrypt(cardDetails.card_number, salt);
		var expiry = cardDetails.expiry.split("/");
		card.cvc = cardDetails.cvc;
		card.expMonth = expiry[0];
		card.expYear = expiry[1];
		card.address=null;
		charge.card = card;
		return charge;
	};
	


	
};

module.exports = new payments();