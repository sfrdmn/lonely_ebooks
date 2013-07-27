var settings = require('../../settings.json')
var env = settings.env
var couchSettings = settings.couchdb[env]
var appSettings = settings.app[env]
var CouchClient = require('./couch-client.js')
var EventEmitter = require('events').EventEmitter
var logger = require('./logger.js')
var inherits = require('util').inherits
var rmanager = require('./resource-manager.js')

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
  }, function(err, artifacts) {
    if (err) {
      logger.error('Error fetching artifacts', err)
    } else {
      logger.info('Fetched artifacts!', artifacts)
      self._process(artifacts)
    }
  })
}

ArtifactManager.prototype._process = function(artifacts) {
  if (Array.isArray(artifacts)) {
    rmanager.loadRemoteImages(artifacts.map(function(artifact) {
      return {
        src: artifact.url,
        id: artifact._id,
        data: artifact
      }
    }), onLoad.bind(this), onDone.bind(this))
  }

  function onLoad(err, type, result, data) {
    if (err) {
      logger.warn('Could not load artifact image', err, data)
    } else {
      data.image = result
      this._queue.push(data)
      this.emit('ready')
      logger.verbose('Loaded artifact image', result)
    }
  }

  function onDone(err, results) {
    logger.verbose('Done loading artifact images')
  }
}

ArtifactManager.prototype.next = function() {
  if (this._queue.length) {
    return this._queue.shift()
  } else {
    logger.warn('Tried to fetch from empty queue')
  }
}

module.exports = new ArtifactManager
