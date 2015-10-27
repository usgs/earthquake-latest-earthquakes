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
  grunt.registerTask('build', function (task) {
    var tasks = [
      'clean:dist',
      'copy:jakefile',
      'replace:leaflet_jakefile',
      'exec:build_leaflet',
      'copy:leaflet_custom',
      'requirejs:dist',
      'replace:html',
      'replace:javascript',
      'replace:leaflet_shim_dist',
      'replace:leaflet_jakefile',
      'configureRewriteRules',
      'connect:dist',
      'postcss:build'
    ];

    if (task === 'legacy') {
      tasks.splice(-2, 0, 'replace:legacyTemplate');
    }

    grunt.task.run(tasks);
  });

  //remove "copy:jakefile", and "replace:leaflet_jakefile"
  //  when Jakefile.js is upgraded with next release.
  grunt.registerTask('default', [
    'clean:dev',
    'dev',
    'test',
    'configureRewriteRules',
    'connect:dev',
    'watch'
  ]);

  grunt.registerTask('dev', [
    'copy:jakefile',
    'replace:leaflet_jakefile',
    'exec:build_leaflet',
    'copy:dev',
    'postcss:dev',
    'requirejs:dev',
    'copy:leaflet_custom', //copies leaflet js
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'dev',
    'copy:dist',
    'postcss:dist',
    'htmlmin',
    'uglify',
    'configureRewriteRules',
    'connect:dist:keepalive'
  ]);

  grunt.registerTask('test', [
    'copy:test',
    'requirejs:test',
    'connect:test',
    'mocha_phantomjs'
  ]);
};
