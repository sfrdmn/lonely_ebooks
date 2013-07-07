var loggingEnabled = require('../../settings.json').logging

module.exports = {
	info: function() { console.log.apply(console, arguments); },
	error: function() { console.log.apply(console, arguments); },
	log: function() { console.log.apply(console, arguments); }
}