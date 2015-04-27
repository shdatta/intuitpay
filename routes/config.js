
var config = {
    'jsonContentType' : 'application/json',
    'utf8' : 'utf-8',
    'paymentsAPI' : {
        'authorization' : 'Intuit_IAM_Authentication intuit_appid=Intuit.smallbusiness.igsbridge.igsbridgeapp, intuit_app_secret=preprdQzjjgNKIIsyCL1Wb102EN58yuHBo6KDh0O',
        'host' : 'transaction-api-e2e.payments.intuit.net',
        'port' : 443,
        'path' : '/v2/charges'
    },
    'httpMethods' : {
        'get' : 'GET',
        'post': 'POST'
    },
    'twilioApi' : {
    	'accountSID' : 'AC6faf15b703ab2223cd5e7fa2bdb61bda',
    	'authToken' : '56779e793837961bae561ef8471742fd',
    }
};



module.exports = config;

