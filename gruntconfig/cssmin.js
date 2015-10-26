'use strict';

var config = require('./config');

var cssmin = {
  options: {
    report: 'min',
    root: config.build + '/' + config.src + '/htdocs',
    processImport: true,
    noRebase: true
  },
  dist: {
    expand: true,
    cwd: config.build + '/' + config.src,
    dest: config.dist,
    src: [
      'htdocs/css/index.css',
      'htdocs/css/documentation.css'
    ]
  }
};

module.exports = cssmin;
