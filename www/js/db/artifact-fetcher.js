var settings = require('../../settings.json')
var env = settings.env
var couchOptions = settings.couchdb[env]
var appOptions = settings.app
var db = require('./couch-client.js')
var async = require('async')

var ArtifactFetcher = function() {}

ArtifactFetcher.prototype.fetchArtifacts = function(count, callback) {
  async.waterfall([

    async.apply(queryView, count, callback),

    // If no results, we queried the end of the view
    // So make another request for the beginning
	function(results, callback) {
  	  if (results && results.rows) {
  	    if (!results.rows.length) {
  	    }
  	  }
  	}
  ])
}

function queryView(count, callback) {
  return db.view(couchOptions.ddoc, couchOptions.views.random, {
	'startkey': Math.random(),
	'limit': count
  })
}

module.exports = ArtifactFetcher
