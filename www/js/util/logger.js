var loggingEnabled = require('../../settings.json').logging
var winston = require('winston')

var transports = []
if (loggingEnabled)
	transports.push(new winston.transports.Console())

module.exports = new winston.Logger({transports: transports})
