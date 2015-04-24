var util = require('util');
var crypto = require('crypto'),
	algorithm = 'aes-256-ctr';

var cryptography = function(){

	this.hash = function(stringToHash, salt) {
		return crypto.createHash('sha256').update(stringToHash+salt, 'utf8').digest('base64');
	}

	this.encrypt = function(text, salt) {
  		var cipher = crypto.createCipher(algorithm, salt);
  		var crypted = cipher.update(text,'utf8','hex');
  		crypted += cipher.final('hex');
  		return crypted;
  	};

  	this.decrypt = function(text, salt){
  		var decipher = crypto.createDecipher(algorithm, salt);
  		var dec = decipher.update(text,'hex','utf8');
  		dec += decipher.final('utf8');
  		return dec;
	};
};

module.exports = new cryptography();