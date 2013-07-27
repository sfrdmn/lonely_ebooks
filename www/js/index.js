var amanager = require('./src/artifact-manager.js')
var createjs = require('createjs')
var logger = require('./src/logger.js')

function App() {
  amanager.fetch(50)
  amanager.on('ready', (function() {
    var artifact = amanager.next()
    var bitmap = new createjs.Bitmap(artifact.image)
    stage.addChild(bitmap)
    stage.update()
  }).bind(this))
}

var canvas = document.getElementById('viewport')
var stage = new createjs.Stage(canvas)


exports.App = App
