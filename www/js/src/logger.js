var logLevel = require('../../settings.json').logLevel
var _ = require('lodash')

// priority moves from left to right
// debug becomes easy way to quickly spew stuff out into otherwise silent console

var levels = ['debug', 'error', 'warn', 'info', 'log']
var levelMap = {}
var fallback = console.log || function() {}

_.each(levels, function(level, i) {
	levelMap[level] = i + 1

	if (typeof console[level] !== 'function') {
		console[level] = fallback
	}

	exports[level] = function() {
		if (logLevel >= levelMap[level])
			console[level].apply(console, arguments); 
	}
})