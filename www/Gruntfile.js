var Handlebars = require('handlebars')

module.exports = function(grunt) {

  var _ = grunt.util._
  var pkg = grunt.file.readJSON('package.json')
  var vendorDir = 'vendor/'
  var buildDir = 'build/'
  var lonelyDir = 'src/'
  var jsDeps = pkg.vendorDependencies.map(function(dep) {
    return 'js/' + vendorDir + dep
  }).concat(pkg.lonelyDependencies.map(function(dep) {
    return 'js/' + lonelyDir + dep
  }))
  var cssDeps = pkg.cssDependencies.map(function(dep) {
    return 'css/' + dep
  })

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    'env-compile': {
      files: [{src: 'index.hbs', dest: buildDir + 'index.html'}],
      production: {
        data: {
          isProduction: true,
          js: [ buildDir + 'js/app.min.js' ],
          css: [ buildDir + 'css/app.min.css' ]
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
    'copy': {
      dev: {
        files: [
          {expand: true, src: 'css/**/*.css', dest: buildDir},
          {expand: true, src: 'js/' + lonelyDir + '*.js', dest: buildDir},
          {expand: true, src: 'js/' + vendorDir + '*.js', dest: buildDir}
        ]
      }
    },
    'watch': {
      files: ['js/**/*.js', 'css/**/*.css', 'index.hbs'],
      tasks: ['default', 'beep']
    },
    'uglify': {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      src: 'build/js/bundle.js',
      dest: 'build/js/bundle.min.js'
    }
  })

  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-beep')

  // Tasks to build template data
  grunt.registerMultiTask('env-compile', 'Merge multiple data contexts and compile template', function(a, b, c) {
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

  // Default task(s).
  grunt.registerTask('dev web', ['env-compile:dev:web', 'copy:dev'])
  grunt.registerTask('dev phonegap', ['env-compile:dev:phonegap', 'copy:dev'])
  grunt.registerTask('build web', ['env-compile:production:web'])
  grunt.registerTask('build phonegap', ['env-compile:production:phonegap'])

  grunt.renameTask('dev web', 'default')
}
