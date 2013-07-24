var _ = require('lodash')
var logger = require('./logger.js')
var url = require('url')
var path = require('path')
var hyperquest = require('hyperquest')
var es = require('event-stream')
var JSONStream = require('JSONStream')

function CouchClient(options) {
	this.options = options || {}
	this.urlObj = options.urlObj || {}
	this.urlObj.query = this.urlObj.query || {}
	logger.info('Created couch client', {url: url.format(this.urlObj)})
}


// returns an object mode stream
CouchClient.prototype.createViewStream = function(ddoc, view, query, parseString) {
	var urlObj = this._extendUrlObj(['_design', ddoc, '_view', view], query)
	var parseString = parseString || 'rows.*'
	var httpStream = hyperquest(url.format(urlObj))
	var jsonStream = JSONStream.parse(parseString)

	return es.pipeline(
		httpStream,
		jsonStream
	)
}

CouchClient.prototype._extendUrlObj = function(pathname, query) {
	var newUrlObj = _.cloneDeep(this.urlObj)
	if (pathname) {
		if (pathname instanceof Array) {
			pathname = path.join.apply(path, pathname)
		}
		newUrlObj.pathname = path.join(newUrlObj.pathname, pathname)
	}
	if (query && newUrlObj.query) {
		newUrlObj.query = _.extend(newUrlObj.query, query)
	}
	return newUrlObj
}

module.exports = CouchClient