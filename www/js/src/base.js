;(function(context) {

/**
 * The namespace
 */
var lonely = context.lonely = {}

/**
 * Always access dependencies through namespace, to get
 * a Node-esque environment going
 * Screw standards B)
 */
var modules = {
  lodash: _,
  jQuery: error,
  '$': error,
  createjs: createjs
}

/**
 * Bail if dependencies not present
 */
for (var key in modules) {
  if (modules.hasOwnProperty(key))
    if (!modules[key]) error()
}

/**
 * Ghetto lil require fuction
 */
lonely.require = function require(name) {
  if (!modules[name]) error()
  else
    return modules[name]
}

lonely.export = function xport(name, module) {
  if (!name || !module) error()
  else
    modules[name] = module
}

function error() {
  throw new Error('Could not resolve module!')
}

})(this)
