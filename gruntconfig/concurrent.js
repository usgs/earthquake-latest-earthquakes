'use strict';

var concurrent = {
  scripts: ['jshint:scripts', 'mocha_phantomjs'],
  tests: ['jshint:tests', 'mocha_phantomjs'],
  predist: [
    'jshint:scripts',
    'jshint:tests',
    'copy'
  ],
  dist: [
    'cssmin:dist',
    'htmlmin:dist',
    'uglify'
  ]
};

module.exports = concurrent;
