'use strict';

var config = require('./config');

var BUILD_TIME = new Date().getTime();

var replace = {
  html: {
    src: [
      config.dist + '/htdocs/index.html'
    ],
    overwrite: true,
    replacements: [
      {
        from: 'data-main="js/index.js" src="/requirejs/require.js"',
        to: 'src="js/index.js?build=' + BUILD_TIME + '"'
      },
      {
        from: 'css/index.css',
        to: 'css/index.css?build=' + BUILD_TIME + '"'
      }
    ]
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
  leaflet_shim_dist: {
    src: [
      config.dist + '/htdocs/js/index.js'
    ],
    overwrite: true,
    replacements: [
      {
        from: 'leaflet/dist/leaflet-custom-src',
        to: 'leaflet/dist/leaflet/leaflet'
      },
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
  },
  legacyTemplate: {
    src: [
      config.dist + '/**/*.php'
    ],
    overwrite: true,
    replacements: [
      {
        from:'include \'template.inc.php\';',
        to: 'include $_SERVER[\'DOCUMENT_ROOT\'] . \'/template/template.inc.php\';'
      }
    ]
  }
};

module.exports = replace;
