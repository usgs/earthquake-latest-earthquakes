'use strict';

var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    cssImport = require('postcss-import'),
    precss = require('precss');

var config = require('./config');

var postcss = {

  dev: {
    options: {
      processors: [
        cssImport({
          path: [
            'node_modules/leaflet/dist'
          ]

        }),
        precss(),
        autoprefixer({'browsers': 'last 2 versions'}) // vendor prefix as needed
      ]
    },
    expand: true,
    cwd: config.src + '/htdocs',
    src: [
      '**/*.css',
      '!**/_*.css'
    ],
    dest: config.build + '/' + config.src + '/htdocs'
  },

  dist: {
    options: {
      processors: [
        cssnano({zindex: false}) // minify
      ]
    },
    expand: true,
    src: [
      '**/*.css'
    ],
    cwd: config.build + '/' + config.src + '/htdocs',
    dest: config.dist + '/htdocs'
  }
};

module.exports = postcss;
