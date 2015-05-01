var Q = require('q');
var http = require('https');
var querystring = require('querystring');
var config = require('./config');
var parseString = require('xml2js').parseString;
var merchant = function(){

	this.getSalt = function(req, phone){
		var deferred = Q.defer();
		var key_sql = 'select salt from PAYDATA.key_information where phone_number = ?';
		var pars = [req.body.phone_number];
		req.app.get('cassandra').execute(key_sql, pars, {prepare:true}, function(err, results){
			if (err){deferred.reject(err);}
			else {deferred.resolve(results);}
		});
		return deferred.promise;
	};
	
	this.getMerchant = function(request, emailAddress) {
		var deferred = Q.defer();	
		var data = {'MerchantEmailMatch': emailAddress};
		
		var headers = {
			'intuit_tid': request.RequestId,
		    'Content-Type': config.jsonContentType,
		    'Authorization': config.ihubAPI.authorization,
		    'CLIENT_USER_ID': config.ihubAPI.clientUserId
		};

		var options = {
			host: config.ihubAPI.host,
  			port: config.ihubAPI.port,
  			path: config.ihubAPI.path + '?' + querystring.stringify(data),
  			method: config.httpMethods.get,
  			headers: headers
		};
		
		var merchantMasterAccount = '';
        
        request.logme(request, "Request iHub:" + emailAddress);
		
		var req = http.request(options, function(res) {
  			res.setEncoding(config.utf8);
			res.on('data', function(data) {
				merchantMasterAccount += data;
  			});

  			res.on('end', function() {
                
                parseString(merchantMasterAccount, function (err, result) {
					if (err){
						request.logme(request, "Error from iHub:" + err);
						request.next(err);
						return;
					}
                	var merchantInfo = result.RestResponse.MerchantMasterAccounts[0].MerchantMasterAccount[0].Merchant[0];//.merchant;
                	var masterInfo = result.RestResponse.MerchantMasterAccounts[0].MerchantMasterAccount[0].MasterAccount[0];
                    request.logme(request, "Response iHub:" + merchantInfo.DBA[0] + "--" + merchantInfo.Phone[0].FreeFormNumber[0]);
                	
                	var merchant = {
        		    	'phoneNumber': merchantInfo.Phone[0].FreeFormNumber[0],
        		    	'reamlId' : masterInfo.RealmId[0],
        		    	'name' : merchantInfo.DBA[0],
        		    	'email' : merchantInfo.Email[0].Address[0]
        		    };
        		    
                	console.log(merchant);
        		    deferred.resolve(merchant);
        		});
            });
		});

		req.on('error', function(e) {
			request.logger.debug(e);
			request.next(e);
		});

		req.end();
		return deferred.promise;
	};
};
module.exports = new merchant();