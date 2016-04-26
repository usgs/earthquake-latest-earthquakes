'use strict';

var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    calc = require('postcss-calc'),
    cssImport = require('postcss-import'),
    precss = require('precss');


var config = require('./config'),
    CWD = '.',
    NODE_MODULES = CWD + '/node_modules';


var postcss = {
  dev: {
    options: {
      map: true,
      processors: [
        cssImport({
          path: [
            CWD + '/' + config.src + '/htdocs',
            NODE_MODULES + '/hazdev-leaflet/src',
            NODE_MODULES + '/hazdev-webutils/src'
            // TODO: node_modules dependencies
          ]
        }),
        precss(),
        calc(),
        autoprefixer({'browsers': 'last 2 versions'}) // vendor prefix as needed
      ]
    },
    expand: true,
    cwd: config.src + '/htdocs',
    src: [
      '**/*.scss',
      '!**/_*.scss'
    ],
    dest: config.build + '/' + config.src + '/htdocs',
    ext: '.css',
    extDot: 'last'
  },

  dist: {
    cwd: config.build + '/' + config.src + '/htdocs',
    dest: config.dist + '/htdocs',
    expand: true,
    options: {
      processors: [
        cssnano({zindex: false}) // minify
      ]
    },
    src: [
      '**/*.css'
    ]
  }
};


module.exports = postcss;
