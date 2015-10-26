'use strict';

var config = require('./config');

var compass = {
  dev: {
    options: {
      sassDir: config.src + '/htdocs/css',
      cssDir: config.build + '/' + config.src + '/htdocs/css',
      environment: 'development'
    }
  }
};

module.exports = compass;
