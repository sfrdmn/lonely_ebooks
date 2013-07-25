var settings = require('../../settings.json')
var env = settings.env
var couchSettings = settings.couchdb[env]
var appSettings = settings.app[env]
var url = require('url')
var path = require('path')
var xhr = require('xhr')
var clone = require('./util.js').clone
var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits

function ArtifactManager() {
  var urlObj = this._fetchUrlObj = clone(couchSettings.urlObj)
  this._fetchUrlObj.pathname = path.join(urlObj.pathname, '/_design',
      couchSettings.ddoc, '/_view', appSettings.aartifactFetchView)
  this._queue = []
}
inherits(ArtifactManager, EventEmitter)

ArtifactManager.prototype.fetch = function(count) {
  this._fetchUrlObj.query = {
   startkey: Math.random(),
   limit: count
  }
  xhr({
    uri: url.format(this._fetchUrlObj)
  }, onComplete.bind(this))

  function onComplete(err, res, body) {
    if (err) {
      // TODO handle
      this.emit('err', err)
    } else {
      this._handle(res, body)
      this.emit('fetch')
    }
  }
}

ArtifactManager.prototype._handle = function(res, body) {
  if (!res.statusCode === 200) {
    console.log('?', res, body)
  } else {
    console.log(res, body)
  }
}

ArtifactManager.prototype.enqueue = function(artifact) {

}

ArtifactManager.prototype.dequeue = function(artifact) {

}

module.exports = ArtifactManager
