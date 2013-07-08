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
          {expand: true, src: 'css/**/*.css', dest: 'build/'},
          {src: 'js/lib/easeljs-0.6.1.min.js', dest: 'build/js/easeljs-0.6.1.min.js'},
          {src: 'js/lib/preloadjs-0.3.1.min.js', dest: 'build/js/preloadjs-0.3.1.min.js'},
          {src: 'js/lib/soundjs-0.4.1.min.js', dest: 'build/js/soundjs-0.4.1.min.js'},
          {src: 'js/lib/tweenjs-0.4.1.min.js', dest: 'build/js/tweenjs-0.4.1.min.js'}
        ]
      }
    },
    'compile-handlebars': {
      web: {
        templateData: {
          build_web: true,
          build_dev: true
        },
        template: 'index.hbs',
        output: 'build/index.html'
      },
      phonegap: {
        templateData: {
          build_phonegap: true,
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
