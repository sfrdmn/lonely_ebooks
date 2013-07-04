module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['js/**/*.js', 'css/**/*.css', 'index.html'],
      tasks: ['default']
    },
    browserify: {
      'build/bundle.js': ['js/index.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      src: 'build/bundle.js',
      dest: 'build/bundle.min.js'
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-browserify')

  // Default task(s).
  grunt.registerTask('default', ['browserify'])
  grunt.registerTask('build', ['browserify', 'uglify'])

}
