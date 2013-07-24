var ResourceManager = require('./src/resource-manager.js')
var es = require('event-stream')
var logger = require('./src/logger.js')

function App() {
  this.manager = new ResourceManager

  var artifactStream = this.manager.createArtifactStream(10)
  var imageLoadStream = this.manager.createImageLoadStream()

  artifactStream.pipe(es.through(function(data) {
    logger.info('Got artifact!', data)
    this.queue(data)
  }))

  artifactStream.on('error', function(err) {
  	logger.error('Problem fetching artifacts', err, err.stack)
  })

  imageLoadStream.pipe(es.through(function(data) {
    logger.info('Got image!', data.image)
    this.queue(data)
  }))

  imageLoadStream.on('error', function(err) {
  	logger.error('Problem loading image', err, err.stack)
  })

  artifactStream.pipe(imageLoadStream)

  logger.log('App started!')
}

module.exports = App
