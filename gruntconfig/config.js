'use strict';

var basePort = 8060;

// App configuration, used throughout
var config = {
  build: '.build',
  devPort: basePort,
  dist: 'dist',
  distPort: basePort + 2,
  etc: 'etc',
  example: 'example',
  examplePort: basePort + 4,
  ini: {
    // TODO: read this from a config file
    OFFSITE_HOST: 'earthquake.usgs.gov'
  },
  liveReloadPort: basePort + 9,
  templatePort: basePort + 3,
  test: 'test',
  testPort: basePort + 1,
  src: 'src'
};


module.exports = config;
