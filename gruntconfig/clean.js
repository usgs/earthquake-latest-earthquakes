'use strict';

var config = require('./config');

var clean = {
  dist: [config.dist],
  dev: [config.build]
};

module.exports = clean;
