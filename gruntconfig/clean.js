'use strict';

var config = require('./config');

var clean = {
  dist: [config.dist],
  dev: [config.build + '/' + config.src],
  test: [config.build + '/' + config.test]
};

module.exports = clean;
