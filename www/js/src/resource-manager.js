var async = require('async')

function ResourceManager() {
}

ResourceManager.prototype.loadAll = function (resources, callback, load) {
}

/**
 * @param images {Array.<{id: string, src: string, type: string, data}>}
 * @param load {ImageLoadCallback}
 * @param done {ImagesDoneCallback}
 */
/**
 * @callback ImageLoadCallback
 * @param err {Object}
 * @param type {string}
 * @param result {Object|Element}
 * @param data {Object}
 */
/**
 * @callback ImageDoneCallback
 * @param err {Object}
 * @param results {Array.<{Object|Element}>}
 */
ResourceManager.prototype.loadRemoteImages = function(imageData, load, done) {
  imageData = imageData || []
  load = typeof load === 'function' ? load : function() {}
  done = typeof done === 'function' ? done : function() {}

  var results = []
  var queue = async.queue(function(imageData, callback) {
    var image = new Image()
    image.src = imageData.src
    image.onload = onImageLoad
    image.onerror = onImageError

    function onImageLoad() {
      results.push(image)
      load(null, imageData.type, image, imageData.data)
      callback()
    }

    function onImageError(err) {
      err = err || new Error('Failed to load image')
      load(err)
      callback(err)
    }
  }, imageData.length)

  queue.drain = onDrain
  queue.push(imageData)

  function onDrain() {
    done(null, results)
  }
}

module.exports = new ResourceManager
