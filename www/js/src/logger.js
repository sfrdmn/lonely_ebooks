/**
 * Can't a guy get a simple transport logging system around here?
 */

var inherits = require('util').inherits

var levels = {error: 0, warn: 1, info: 2, verbose: 3, silly: 4}

function Logger(options) {
  this.configure(options)
}

var canTrace = typeof (new Error).stack === 'string'

Logger.prototype.configure = function (options) {
  options = options || {}
  if (options.transports && options.transports.length) {
    options.transports.forEach(function(transport) {
      this.addTransport(transport)
    })
  } else {
    this.addTransport('console')
  }
  this._logLevel = options.level || 3
}

Logger.prototype.addTransport = function (transport) {
  if (!this._transports)
    this._transports = []
  if (transports[transport])
    this._transports.push(new transports[transport])
  else
    (new ConsoleTransport).log('warn', 'Bad transport specified in logger')
}

Logger.prototype._transport = function (level, msgs) {
  this._transports.forEach(function(transport) {
    if (level === 'error' && canTrace) {
      // Get stack trace and trim out logger calls
      msgs.push('\n' + (new Error).stack.split('\n').slice(5).join('\n'))
    }
    transport.log(level, msgs)
  })
}

Object.keys(levels).forEach(function(level) {
  Logger.prototype[level] = function() {
    var msgs = [].slice.call(arguments, 0)
    this._transport(level, msgs)
  }
})

function ConsoleTransport() {
  this._console = console || {}
  this._console.log = (typeof this._console.log === 'function' &&
      this._console.log) || function() {}
  this._headers = ConsoleTransport.headers
}

ConsoleTransport.prototype.log = function(level, msgs) {
  if (this._headers[level]) {
    this._console.log.apply(this._console, this._headers[level].concat(msgs))
  } else {
    this.log('warn', 'Bad log method for ConsoleTransport')
  }
}

ConsoleTransport.headers = {
  'error': ['%c  error  ', 'background-color: #e10; color: #eee'],
  'warn': ['%c  warn   ', 'background-color: #ea0; color: #eee'],
  'info': ['%c  info   ', 'background-color: #06a; color: #eee'],
  'verbose': ['%c verbose ', 'background-color: #0a4; color: #eee'],
  'silly': ['%c  silly  ', 'background-color: #a4a; color: #eee'],
}

var transports = {
  console: ConsoleTransport
}

module.exports = new Logger
module.exports.Logger = Logger
module.exports.transports = transports
