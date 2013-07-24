var es = require('event-stream')
var settings = require('../../settings.json')
var env = settings.env
var logger = require('./logger.js')
var CouchClient = require('./couch-client.js')

function ResourceManager() {
	this.couchOptions = settings.couchdb[env]
	this.couch = new CouchClient(this.couchOptions)
}

/**
 * Fetch artifact data from server
 */
ResourceManager.prototype.createArtifactStream = function(count) {
	return this.couch.createViewStream(
			this.couchOptions.ddoc, this.couchOptions.views.random, {
	  'startkey': Math.random(),
	  'limit': count,
	  'include_docs': true
    }, 'rows.*.doc')
}

/**
 * Asynchronously load images associated with image metadata and attach
 * to artifact object
 */
ResourceManager.prototype.createImageLoadStream = function() {
	return es.map(function(data, callback) {
		if (data.url) {
			var image = data.image = new Image()
			image.src = data.url
			image.onload = onLoad
			image.onError = onError
		} else {
			callback(new Error('No image metadata in artifact'))
		}

		function onLoad() {
			callback(null, data)
		}

		function onError(err) {
			callback(new Error('Could not load image'))
		}
	})
}

module.exports = ResourceManager
