
 var util = require('util');
 var cryptography = require('./cryptography');
 var merchant = require('./merchant');
 var user = require('./user');
 var payments = require('./payments');
 var merchant = require('./merchant');

exports.index = function(req, res){
	res.send('<div>IntuitPay</div>');
};

exports.createuser = function(req, res, next){
	var insertkey = 'INSERT INTO PAYDATA.key_information (phone_number, salt) VALUES(?, ?)';
	var salt = req.app.get('uuid').v4().toString();
	var keyparams = [req.body.phone_number,  salt];

	req.app.get('cassandra').execute(insertkey, keyparams, {prepare: true}, function(err, results){
		if (err){ return next(err);}
		var insert = 'INSERT INTO PAYDATA.phone_information (phone_number, username, email, password, pin, enabled) VALUES(?, ?, ?, ?, ?, ?)';
		var password = cryptography.hash(req.body.password, salt);
		var pin = cryptography.hash(req.body.pin, salt);
		var params = [req.body.phone_number, req.body.username, req.body.email, password, pin, true];

		req.app.get('cassandra').execute(insert, params, function(err, users){
		    if(err){return next(err);}
	    	req.body.message = 'Created user: ' + req.body.username;
	    	res.send(req.body);
	  	});
	});
};

var getSalt = function(req, res, upsert){
	var key_sql = 'select salt from PAYDATA.key_information where phone_number = ?';
	var pars = [req.body.phone_number];
	req.app.get('cassandra').execute(key_sql, pars, {prepare:true}, function(err, results){
		return upsert(err, err !== null ? null : results.rows[0].salt);
	});
};

var createcard = function(req, res, salt, next){
	var card_number = cryptography.encrypt(req.body.card_number, salt);
	var id = req.app.get('uuid').v4().toString();
	var insertSql = 'INSERT INTO PAYDATA.card_information (phone_number, id, cvc,\
		nick_name, name, type, expiry, card_number) \
		VALUES(?,?,?,?,?,?,?,?)';

	var params = [req.body.phone_number, id, req.body.cvc, req.body.nick_name, req.body.name, req.body.type, req.body.expiry, card_number];
	req.app.get('cassandra').execute(insertSql, params, {prepare:true}, function(err, results){
	    if(err){return next(err);}
    	req.body.message = 'Added card ' + req.body.nick_name;
    	req.body.id = id;
        res.send(req.body);
  	});
};
var updatecard = function(req, res, salt, next){
	// var card_number = cryptography.encrypt(req.body.card_number, salt);
	var updateSql = 'UPDATE PAYDATA.card_information set cvc = ?, nick_name = ?, name = ? , type = ?, expiry = ? \
	 	WHERE phone_number = ? and id = ?';

	var params = [req.body.cvc, req.body.nick_name, req.body.name, req.body.type, req.body.expiry, req.body.phone_number, req.body.id];
	req.app.get('cassandra').execute(updateSql, params, {prepare:true}, function(err, results){
	    if(err){return next(err);}
    	req.body.created = 'Updated card';
    	res.send(req.body.id);
  	});
};	

exports.createupdatecard = function(req, res, next){
	getSalt(req, res, function(err, salt){
		if (err) {return next(err);}
		if (req.body.id === "-1"){
			return createcard(req, res, salt);
		}
		else{
			return updatecard(req, res, salt);
		}
	});
};	

var extractPaymentDetails = function(req){
	var paymentDetails = new Object();
	paymentDetails.amount = req.body.amount;
	paymentDetails.chargeId = req.body.chargeId;
	return paymentDetails;
};

var extractcardDetails = function(req){
	var rows;
	user.getCardInfo(req, req.body.phone_number, req.body.id)
	.then(function(results){
		console.log(results);
		return results;
	});
};

exports.sale = function(req, res, next){
	merchant.getSalt(req, req.body.phone_number)
	.then(function(results){
		var salt = results.rows[0].salt;
		user.getCardInfo(req, req.body.phone_number, req.body.id)
        .then(function(results){
            user.getUserDetails(req)
            .then(function(details){
                if (cryptography.hash(req.body.pin, salt) !== details.rows[0].pin){
                    next(new Error("Invalid pin"));
                    return;
                }
                var card = results.rows[0];
                var merDetails = extractPaymentDetails(req);
                var charge = payments.getCharge(merDetails, card, salt);
                merchant.getMerchant(req, req.body.intuitId)
            	.then(function(results) {
            		merDetails.merchantId = results.reamlId;
            		merDetails.phone = results.phoneNumber;
            		merDetails.name = results.name;
            		merDetails.email = results.email;
            	    payments.sale(req, merDetails, charge);
            	});
                
            });
        });
	});
};



