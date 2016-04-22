module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    stylus:{
      build: {
        options: {
          linenos: false,
          compress: false
        },
        files: [{
          'public/stylesheets/mine.css': 'public/stylesheets/mine.styl'
        }]
      }
    },
    watch: {
      styl: {
        files: ['public/stylesheets/*.styl'],
        tasks: ['stylus'],
        options: {
          livereload: 1337
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};