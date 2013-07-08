var settings = require('../../settings.json')
var env = settings.env
var couchOptions = settings.couchdb[env]
var appOptions = settings.app
var db = require('./couch-client.js')
var logger = require('../util/logger.js')
var es = require('event-stream')

var ArtifactFetcher = function() {}

ArtifactFetcher.prototype.fetchArtifacts = function(count) {
	logger.info('Fetching ' + count + ' artifacts')

	return db.createViewStream(couchOptions.ddoc, couchOptions.views.random, {
	  'startkey': Math.random(),
	  'limit': count,
	  'include_docs': true
    }, 'rows.*.doc')
}

module.exports = new ArtifactFetcher()