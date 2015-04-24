
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
    }
};



module.exports = config;

