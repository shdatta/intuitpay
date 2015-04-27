
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
    	'accountSid' : 'ACa77fee3eecb97b6f62515e4cd87bc884',
    	'authToken' : '4fd14295967407d143691f1d76014549',
    	'from' : '415-599-2671'
    }
};



module.exports = config;

