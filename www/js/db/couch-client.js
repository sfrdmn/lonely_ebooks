/**
 * Pre-configure couch client with app settings
 */

var settings = require('../../settings.json')
var env = settings.env
var options = settings.couchdb[env]
var logger = require('../util/logger.js')
var url = require('url')
var couchdb = require('felix-couchdb')

var urlObj = options.urlObj
var creds = []
var clientArgs = [urlObj.port, urlObj.hostname]

if (urlObj.auth)
	creds = urlObj.auth.split(':')

if (creds.length)
	clientArgs.concat([creds[0], creds[1], 11, true])

var couchClient = couchdb.createClient.apply(couchdb, clientArgs)
var dbClient = couchClient.db(urlObj.pathname.slice(1))

logger.info('Created couch client!', url.format(urlObj))

module.exports = dbClient