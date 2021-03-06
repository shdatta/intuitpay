 var util = require('util');
 var cryptography = require('./cryptography');
 var cassandra = require('cassandra-driver');
 var Q = require ('q');

 var user =  function(){
	 	this.getCardInfo = function(req, phone, id){
		 	var deferred = Q.defer();
 			var card_sql = 'select name, card_number, expiry, cvc from PAYDATA.card_information where phone_number = ? and id = ?';
			var pars = [phone, id];
			req.app.get('cassandra').execute(card_sql, pars, {prepare:true}, function(err, results){
				if (err){deferred.reject(err);}
				else {deferred.resolve(results);}
			});
			return deferred.promise;
 		}
        
        this.getUserDetails = function(req){
            var deferred = Q.defer();
            var detailsSql = 'select email, password, pin from PAYDATA.phone_information where phone_number = ?';
            var pars = [req.body.phone_number];
			req.app.get('cassandra').execute(detailsSql, pars, {prepare:true}, function(err, results){
				if (err){deferred.reject(err);}
				else {deferred.resolve(results);}
			});
			return deferred.promise;
        }
};

module.exports = new user();