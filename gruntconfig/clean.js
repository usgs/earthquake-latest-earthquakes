'use strict';

var config = require('./config');

var clean = {
  dist: [config.dist],
  dev: [config.build, '.sass-cache']
};

module.exports = clean;
