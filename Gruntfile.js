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
    'clean:dev',
    'copy:jakefile',
    'replace:leaflet_jakefile',
    'exec:build_leaflet',
    'copy:leaflet_custom',
    'copy:dev',
    'postcss:dev',
    'requirejs:dev'
  ]);

  grunt.registerTask('builddist', [
    'clean:dist',
    'copy:dist',
    'postcss:dist',
    'htmlmin',
    'uglify',
    'replace:html', // use build time as cache buster
    'replace:javascript'
  ]);

  grunt.registerTask('buildtest', [
    'clean:test',
    'copy:test',
    'requirejs:test'
  ]);

  grunt.registerTask('default', ['dev']);

  grunt.registerTask('dev', [
    'builddev',

    'test',

    'configureProxies:dev',
    'connect:template',
    'connect:dev',
    'watch'
  ]);

  grunt.registerTask('dist', [
    'builddev',
    'builddist',

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
