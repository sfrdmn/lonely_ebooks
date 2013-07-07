var settings = require('../../settings.json')
var env = settings.env
var couchOptions = settings.couchdb[env]
var appOptions = settings.app
var db = require('./couch-client.js')
var logger = require('../util/logger.js')
var es = require('event-stream')

var ArtifactFetcher = function() {}

ArtifactFetcher.prototype.fetchArtifacts = function(count, mapFn) {
	var mapFn = mapFn || defaultMapFn

	logger.info('Fetching ' + count + ' artifacts')

	return es.pipeline(
	  createArtifactStream(count),
	  es.map(mapFn)
	)

	function createArtifactStream(count) {
  	  return db.createViewStream(couchOptions.ddoc, couchOptions.views.random, {
	    'startkey': Math.random(),
	    'limit': count,
	    'include_docs': true
      }, 'rows.*.doc')
    }

    function defaultMapFn(artifact, callback) {
    	logger.info('Got artifact:', artifact)
    	callback(null, artifact)
    }
}

module.exports = new ArtifactFetcher()