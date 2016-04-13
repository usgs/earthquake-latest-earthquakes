'use strict';

var config = require('./config');


var ALL_CLASSES,
    CWD,
    JS,
    NODE_MODULES;

CWD = '.';
JS = CWD + '/' + config.src + '/htdocs/js';
NODE_MODULES = CWD + '/node_modules';


/**
 * Function to build aliases for browserify.
 *
 * @param basePath {String}
 *     directory containing classes.
 * @param classes {Array<String>}
 *     array of class names.
 * @return {Array<String>}
 *     alias map for browserify.
 */
var getAliases = function (basePath, classes) {
  return classes.map(function (c) {
    return basePath + '/' + c + '.js:' + c;
  });
};


ALL_CLASSES = getAliases(JS, [
  'LatestEarthquakes',

  'core/Formatter',

  'latesteqs/Catalog',
  'latesteqs/Config',

  'list/DefaultListFormat',
  'list/PagerListFormat',
  'list/ShakeMapListFormat',

  'summary/EventSummaryFormat'
]).concat(getAliases(NODE_MODULES + '/hazdev-webutils/src', [
  'mvc/Collection',
  'mvc/Model',

  'util/Xhr'
]));


var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        JS,
        NODE_MODULES + '/hazdev-webutils/src'
      ]
    }
  },

  bundle: {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/js/bundle.js',
    options: {
      alias: ALL_CLASSES
    }
  },

  index: {
    src: [JS + '/index.js'],
    dest: config.build + '/' + JS + '/index.js',
    options: {
    }
  },

  test: {
    src: [config.test + '/test.js'],
    dest: config.build + '/' + config.test + '/test.js',
    options: {
      external: ALL_CLASSES
    }
  }
};


module.exports = browserify;
