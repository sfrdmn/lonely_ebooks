var Handlebars = require('handlebars')
var moduleify = require('moduleify')

module.exports = function(grunt) {

  var _ = grunt.util._
  var pkg = grunt.file.readJSON('package.json')
  var buildDir = 'build/'
  var jsDeps = [
    'js/bundle.js'
  ]
  var cssDeps = [
    'css/normalize.css',
    'css/main.css'
  ]

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    'env-compile': {
      files: [{src: 'index.hbs', dest: 'build/index.html'}],
      production: {
        data: {
          isProduction: true,
          js: [ '/js/app.min.js' ],
          css: [ '/css/app.min.css' ]
        }
      },
      dev: {
        data: {
          isDev: true,
          js: jsDeps,
          css: cssDeps
        }
      },
      web: {
        data: {
          isWeb: true
        }
      },
      phonegap: {
        files: '<%= envcompile.files %>',
        data: {
          isPhonegap: true
        }
      }
    },
    'concat': {
      createjs: {
        options: {
          banner: '(function() {',
          footer: '}).call(window)'
        },
        files: [{
          src: [
            'js/vendor/easeljs*.js',
            'js/vendor/tweenjs*.js',
            'js/vendor/soundjs*.js',
            'js/vendor/preloadjs*.js'
          ],
          dest: 'build/js/create.js'
        }]
      }
    },
    'browserify': {
      options: {
        alias: [
          'js/index.js:lonely',
          'js/vendor/mbp.js:MBP',
          'build/js/create.js:createjs'
        ],
        transform: [moduleify({
          'js/vendor/mbp.js': 'MBP',
          'build/js/create.js': 'createjs'
        })]
      },
      'build/js/bundle.js': 'js/app.js'
    },
    'copy': {
      // dev: {
      //   files: [
      //     {expand: true, src: 'css/**/*.css', dest: builddir},
      //     {expand: true, src: 'js/' + lonelydir + '*.js', dest: builddir},
      //     {expand: true, src: 'js/' + vendordir + '*.js', dest: builddir}
      //   ]
      // }
    },
    'watch': {
      files: ['js/**/*.js', 'css/**/*.css', 'index.hbs', 'settings.json'],
      tasks: ['default', 'beep']
    },
    'uglify': {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      files: [
      ]
    }
  })

  // Tasks to build template data
  grunt.registerMultiTask('env-compile', 'Merge multiple data contexts and compile template',
      function() {
    var self = this
    var name = this.name || 'env-compile'
    var templateData = {}
    var targets = [this.target].concat([].slice.call(arguments))
    grunt.verbose.writeln('Targets:', targets)
    var files = grunt.config([name, 'files']) || []
    if (!targets.length)
      throw new Error('No targets for env-compile!')
    if (!files.length)
      throw new Error('No files for env-compile!')

    targets.forEach(function(target) {
      var srcData = grunt.config([name, target, 'data'])
      grunt.verbose.writeln('Merging target ' + target + ':', srcData)
      mergeTemplateData(templateData, srcData)
    })
    files.forEach(function(file) {
      var templateFile = grunt.file.read(file.src)
      var template = Handlebars.compile(templateFile)
      var outputFile = template(templateData)
      grunt.verbose.writeln('Writing ' + file.dest + ' with:', templateData)
      grunt.file.write(file.dest, outputFile)
    })

    function mergeTemplateData(dest, src) {
      // concat if array
      return _.extend(dest, src, function(destVal, srcVal) {
        if (Array.isArray(destVal) && Array.isArray(srcVal))
          return destVal.concat(srcVal)
        else
          return srcVal
      })
    }
  })

  // npm load
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-beep')

  // Default task(s).
  grunt.registerTask('dev web', ['env-compile:dev:web', 'concat', 'browserify'])
  grunt.registerTask('dev phonegap', ['env-compile:dev:phonegap'])
  grunt.registerTask('build web', ['env-compile:production:web'])
  grunt.registerTask('build phonegap', ['env-compile:production:phonegap'])

  grunt.renameTask('dev web', 'default')
}
