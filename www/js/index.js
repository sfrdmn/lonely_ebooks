var App = require('./src/app.js')

document.addEventListener('deviceready', function() {
    window.app = new App()
}, false)

document.addEventListener('DOMContentLoaded', function() {
    window.app = new App()
}, false)
