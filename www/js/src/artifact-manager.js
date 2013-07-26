var settings = require('../../settings.json')
var env = settings.env
var couchSettings = settings.couchdb[env]
var appSettings = settings.app[env]
var CouchClient = require('./couch-client.js')
var EventEmitter = require('events').EventEmitter
var logger = require('./logger.js')
var inherits = require('util').inherits

function ArtifactManager() {
  this.couch = new CouchClient({
    host: couchSettings.host,
    port: couchSettings.port,
    db: couchSettings.db,
    protocol: couchSettings.protocol
  })
  this._queue = []
}
inherits(ArtifactManager, EventEmitter)

ArtifactManager.prototype.fetch = function(count) {
  var self = this
  this.couch.view(couchSettings.ddoc, 'random', {
    startkey: Math.random(),
    limit: count
  }, function(err, data) {
    if (err) {
      logger.error('Error fetching artifacts', err)
    } else {
      logger.info('Fetched artifacts!', data)
      self.enqueue(data)
    }
  })
}

ArtifactManager.prototype.enqueue = function(artifact) {
  if (Array.isArray(artifact)) {
    this._queue.concat(artifact)
  } else {
    this.push(artifact)
  }
  this.emit('ready')
}

ArtifactManager.prototype.next = function() {
  if (this._queue.length) {
    return this._queue.shift()
  }
}

module.exports = ArtifactManager
