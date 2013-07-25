var ResourceMananger = require('./src/resource-manager.js')
var ArtifactManager = require('./src/artifact-manager.js')
var createjs = require('createjs')

function App() {
  this.am = new ArtifactManager()
  this.am.fetch(10)
}

exports.App = App
