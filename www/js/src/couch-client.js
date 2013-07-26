var inherits = require('util').inherits
var logger = require('./logger.js')
var EventEmitter = require('events').EventEmitter
var xhr = require('xhr')
var clone = require('clone')
var url = require('url')
var path = require('path')

function CouchClient(options) {
  this._host = options.host || 'localhost'
  this._db = options.db
  this._protocol = options.protocol
  this._port = options.port || 5984
}
inherits(CouchClient, EventEmitter)

CouchClient.prototype._getUrlObj = function() {
  return {
    hostname: this._host,
    pathname: '/' + this._db,
    port: this._port,
    protocol: this._protocol
  }
}

CouchClient.prototype.view = function(ddoc, view, query, callback) {
  var pathname = path.join('/_design', ddoc, '/_view', view)
  this._makeRequest(pathname, query, function(err, data) {
    if (err) {
      callback(err)
    } else {
      callback(null, data.rows.map(function(row) {
        return row.value
      }))
    }
  })
}

CouchClient.prototype._makeRequest = function(pathname, query, callback) {
  var urlObj = this._getUrlObj()
  urlObj.pathname = path.join(urlObj.pathname, pathname)
  urlObj.query = query
  var uri = url.format(urlObj)
  logger.verbose('Sending couch request', uri)
  xhr({
    uri: uri
  }, onComplete)

  function onComplete(err, res, body) {
    logger.verbose('Got couch response', res.statusCode)
    if (err) {
      logger.error('Error making couch XHR', err, err.message)
      callback(err)
    } else {
      try {
        var data = JSON.parse(body)
        var parsed = true
      } catch(err) {
        logger.error('Error parsing couch JSON', err, err.message)
        callback(err)
      }
      if (parsed) {
        if (data.error) {
          logger.error('Couch responded with error', err)
          callback(data)
        } else {
          callback(null, data)
        }
      }
    }
  }
}

module.exports = CouchClient
