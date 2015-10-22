'use strict';

var basePort = 8060;

// App configuration, used throughout
var config = {
  build: '.build',
  src: 'src',
  devPort: basePort,
  dist: 'dist',
  distPort: basePort + 2,
  test: 'test',
  testPort: basePort + 1,
  tmp: '.tmp',
  liveReloadPort: basePort + 9,
  templatePort: basePort + 3
};

module.exports = config;
