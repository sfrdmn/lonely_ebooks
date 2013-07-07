var _ = require('lodash')
var settings = require('../../settings.json')
var env = settings.env
var options = settings.couchdb[env]
var logger = require('../util/logger.js')
var url = require('url')
var path = require('path')
var hyperquest = require('hyperquest')
var es = require('event-stream')
var JSONStream = require('JSONStream')

function CouchClient(options) {
	this.options = options || {}
	this.urlObj = options.urlObj || {}
	this.urlObj.query = this.urlObj.query || {}
}


// returns an object mode stream
CouchClient.prototype.createViewStream = function(ddoc, view, query, parseString) {
	var urlObj = this._extendUrlObj(['_design', ddoc, '_view', view], query)
	var parseString = parseString || 'rows.*'
	return es.pipeline(
		hyperquest(url.format(urlObj)),
		JSONStream.parse(parseString)
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

var client = new CouchClient(options)

logger.info('Created couch client', {url: url.format(client.urlObj)})

module.exports = client