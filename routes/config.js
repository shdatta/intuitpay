
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
    },
    'icnEmailAPI' : {
        'authorization' : 'Intuit_IAM_Authentication intuit_appid=Intuit.smallbusiness.sparklessons.sparklessons, intuit_app_secret=preprdMI5Hrm02EG4kVyEP5QqBHY25lBx40NBlsR, intuit_token_type=IAM-Ticket, intuit_realmid=1111, intuit_token=email-swagger, intuit_intuitid=254429870, intuit_version=1.0',
        'host' : 'commerceemail-e2e.platform.intuit.net',
        'port' : 443,
        'path' : '/v2/responsys/mails'
    },
    'email':{
        locale : 'en-US',
        fromEmailDisplayName : 'Intuit E-Commerce Service',
        replyEmailAddress : 'no-reply@intuit.com',
        product : "SWAGGER",
        costCenter : "1111",
        subject : "Intuit Pay Recepit",
        template : "SWAGGER_TEST"
    },
    'ihubAPI' : {
    	'clientUserId' : 'IntuitPay',
        'authorization' : 'Intuit_IAM_Authentication intuit_appid="intuit.some.appid",  intuit_app_secret="somesecret",  intuit_token_type="",  intuit_token="",  intuit_userid="",  intuit_realmid="",  intuit_version="",   intuit_app_token=""',
        'host' : 'cdm-qa1.payments.intuit.com',
        'port' : 443,
        'path' : '/v2/merchantmasteraccount'

    }
};



module.exports = config;

