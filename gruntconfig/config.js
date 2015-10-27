'use strict';

var basePort = 8060;

// App configuration, used throughout
var config = {
  build: '.build',
  devPort: basePort,
  dist: 'dist',
  distPort: basePort + 2,
  liveReloadPort: basePort + 9,
  templatePort: basePort + 3,
  test: 'test',
  testPort: basePort + 1,
  tmp: '.tmp',
  src: 'src'
};

module.exports = config;
