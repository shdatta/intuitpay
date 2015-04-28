var Q = require('q');

var merchant = function(){

	this.realmId = function(intuitId){
		return '1019017762';

	};
    
    this.phone = function(intuitId){
        return '8182884341';
    };
    
    this.name = function(intuitId){
        return 'Intuit Software Services';
    }

	this.getSalt = function(req, phone){
		var deferred = Q.defer();
		var key_sql = 'select salt from PAYDATA.key_information where phone_number = ?';
		var pars = [req.body.phone_number];
		req.app.get('cassandra').execute(key_sql, pars, {prepare:true}, function(err, results){
			if (err){deferred.reject(err);}
			else {deferred.resolve(results);}
		});
		return deferred.promise;
	}
};
module.exports = new merchant();