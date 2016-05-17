'use strict';

var config = require('./config');

var uglify = {
  options: {
    mangle: true,
    compress: {},
    report: 'min'
  },

  dist: {
    files: [{
      expand: true,
      cwd: config.build + '/' + config.src,
      src: [
      '**/*.js',
      '!**/bundle.js'
      ],
      dest: config.dist
    }]
  }
};

module.exports = uglify;
