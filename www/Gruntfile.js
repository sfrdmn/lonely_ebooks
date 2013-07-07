module.exports = function(grunt) {

  var templateData = {
    web: {},
    phonegap: {}
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'copy': {
      all: {
        files: [
          {expand: true, src: 'css/**/*.css', dest: 'build/'}
        ]
      }
    },
    'compile-handlebars': {
      web: {
        templateData: {
          build_web: true,
          test: 'ok'
        },
        template: 'index.hbs',
        output: 'build/index.html'
      },
      phonegap: {
        templateData: {
          build_phonegap: true,
          test: 'riguht on'
        },
        template: 'index.hbs',
        output: 'build/index.html'
      }
    },
    'watch': {
      files: ['js/**/*.js', 'css/**/*.css', 'index.hbs'],
      tasks: ['default']
    },
    'browserify': {
      options: {
        alias: ['js/app.js:LonelyEbooks']
      },
      'build/js/bundle.js': 'js/app.js'
    },
    'uglify': {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      src: 'build/js/bundle.js',
      dest: 'build/js/bundle.min.js'
    }
  })

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-compile-handlebars')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-browserify')

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'compile-handlebars:web', 'copy'])
  grunt.registerTask('build web', ['browserify', 'compile-handlebars:web', 'copy', 'uglify'])

}
