'use strict';
module.exports = function (grunt) {

  var gruntconfig = require('./gruntconfig');

  gruntconfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntconfig);

  grunt.event.on('watch', function (action, filepath) {
    // Only lint the file that actually changed
    grunt.config(['jshint', 'scripts'], filepath);
  });

  //remove "copy:jakefile", and "replace:leaflet_jakefile"
  //  when Jakefile.js is upgraded with next release.
  grunt.registerTask('builddev', [
    'clean:build',
    'copy:leaflet',
    'copy:dev',
    'postcss:dev',
    'browserify'
  ]);

  grunt.registerTask('buildtest', [
    'copy:test',
    'browserify:test'
  ]);

  grunt.registerTask('default', ['dev']);

  grunt.registerTask('dev', [
    'builddev',

    'test',

    'configureProxies:dev',
    'configureProxies:example',
    'connect:template',
    'connect:dev',
    'connect:example',
    'watch'
  ]);

  grunt.registerTask('dist', [
    'builddev',
    'clean:dist',
    'copy:dist',
    'postcss:dist',
    'uglify',

    'connect:template',
    'configureProxies:dist',
    'connect:dist:keepalive'
  ]);

  grunt.registerTask('test', [
    'buildtest',
    'connect:test',
    'mocha_phantomjs'
  ]);
};
