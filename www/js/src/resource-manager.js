var createjs = require('createjs')

function ResourceManager() {
  this.queue = createjs.LoadQueue()
}

ResourceManager.prototype.loadAll = function loadAll(resources, callback, load) {
  var _resources = resources || {}
  var _callback = typeof callback === 'function' ? callback : function() {}
  var _load = typeof load === 'undefined' ? true : load

  this.queue.loadManifest(_resources, _load)
  this.queue.addEventListener('complete', callback)
}

module.exports = ResourceManager
