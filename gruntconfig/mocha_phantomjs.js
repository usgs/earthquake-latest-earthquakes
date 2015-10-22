'use strict';
var config = require('./connect').test.options;

var mocha_phantomjs = {
  all: {
    options: {
      urls: [
        'http://localhost:<%= connect.test.options.port %>/index.html'
      ]
    }
  }
};
module.exports = mocha_phantomjs;
