'use strict';

var config = require('./config');

var BUILD_TIME = new Date().getTime();

var replace = {
  html: {
    overwrite: true,
    replacements: [
      {
        from: '"js/index.js"',
        to: '"js/index.js?' + BUILD_TIME + '"'
      },
      {
        from: '"css/index.css"',
        to: '"css/index.css?' + BUILD_TIME + '"'
      }
    ],
    src: [config.dist + '/htdocs/index.html']
  },
  javascript: {
    src: [
      config.dist + '/htdocs/js/index.js'
    ],
    overwrite: true,
    replacements: [
      {
        from: '"stamp="+(new Date).getTime()',
        to: '"build=' + BUILD_TIME + '"'
      }
    ]
  },
  leaflet_jakefile: {
    src: [
    'node_modules/leaflet/Jakefile_custom.js'
    ],
    overwrite: true,
    replacements: [
      {
        from: 'build.build(complete);',
        to: 'build.build(complete, compsBase32, buildName);'
      },
      {
        from: 'task(\'build\', {async: true}, function ()',
        to: 'task(\'build\', {async: true}, function (compsBase32, buildName)'
      }
    ]
  }
};

module.exports = replace;
