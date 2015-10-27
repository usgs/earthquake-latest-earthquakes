'use strict';

var config = {
  config: require('./config'),
  postcss: require('./postcss'),
  clean: require('./clean'),
  connect: require('./connect'),
  copy: require('./copy'),
  exec: require('./exec'),
  htmlmin: require('./htmlmin'),
  jshint: require('./jshint'),
  mocha_phantomjs: require('./mocha_phantomjs'),
  replace: require('./replace'),
  requirejs: require('./requirejs'),
  uglify: require('./uglify'),
  watch: require('./watch'),

  tasks: [
    'grunt-connect-proxy',
    'grunt-connect-rewrite',
    'grunt-contrib-clean',
    'grunt-contrib-connect',
    'grunt-contrib-copy',
    'grunt-contrib-htmlmin',
    'grunt-contrib-jshint',
    'grunt-contrib-requirejs',
    'grunt-contrib-uglify',
    'grunt-contrib-watch',
    'grunt-exec',
    'grunt-mocha-phantomjs',
    'grunt-text-replace',
    'grunt-postcss'
  ]
};

module.exports = config;
