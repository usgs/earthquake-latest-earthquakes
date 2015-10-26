'use strict';
var config = require('./config');

var mocha_phantomjs = {
  all: {
    options: {
      urls: [
        'http://localhost:' + config.testPort + '/test.html'
      ]
    }
  }
};
module.exports = mocha_phantomjs;
