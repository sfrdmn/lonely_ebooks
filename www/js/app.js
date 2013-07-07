var af = require('./db/artifact-fetcher.js')
var logger = require('./util/logger.js')

function App() {
  console.log('App started!')
  af.fetchArtifacts(10).on('error', function(err) {
  	logger.error('Problem fetching artifacts', err, err.stack)
  })
}

module.exports = App
