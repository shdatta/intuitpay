var http = require('https');
var config = require('./config');

var email = function() {
    
    this.email = function(request, merchDetails, charge){

        var headers = {
            'Content-Type' : config.jsonContentType,
            'Authorization' : config.icnEmailAPI.authorization,
        };

        var options = {
            host : config.icnEmailAPI.host,
            port : config.icnEmailAPI.port,
            path : config.icnEmailAPI.path,
            method : config.httpMethods.post,
            headers : headers
        };

        var createEmailRequest = function(merchDetails, charge) {
            var templateVariables = {
                firstValue : charge.card.name,
                secondValue : charge.amount
            };

            var email = config.email;
            email.toEmailAddress = merchDetails.email;
            email.templateVariables = templateVariables;
            return email;
        };

        var emailRequest = createEmailRequest(merchDetails, charge);
        var userString = JSON.stringify(emailRequest);
        request.logme(request, "Request to EmailApi:" + userString);

        var req = http.request(options, function(res) {
            var responseString = '';
            res.on('data', function(chunk) {
                console.log('Body: ' + chunk);
            });
            res.on('end', function() {
                request.logme(request, "Email Sent");
            });
        });

        req.on('error', function(e) {
            request.logme('problem with request: ' + e.message);
        });

        req.write(userString);
        req.end();
    }
};

module.exports = new email();
	