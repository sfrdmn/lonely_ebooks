var af = require('./db/artifact-fetcher.js')
var logger = require('./util/logger.js')
var caat = require('caat')

function App() {
  logger.debug('App started!')
  logger.debug('CAAT', caat)
  af.fetchArtifacts(10).on('error', function(err) {
  	logger.error('Problem fetching artifacts', err, err.stack)
  })
}

module.exports = App
