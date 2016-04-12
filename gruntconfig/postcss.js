'use strict';

var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    cssImport = require('postcss-import'),
    precss = require('precss');


var config = require('./config');


var postcss = {
  dev: {
    cwd: config.src + '/htdocs',
    dest: config.build + '/' + config.src + '/htdocs',
    expand: true,
    options: {
      processors: [
        cssImport({
          path: [
            // TODO: node_modules dependencies
          ]
        }),
        precss(),
        autoprefixer({'browsers': 'last 2 versions'}) // vendor prefix as needed
      ]
    },
    src: [
      '**/*.scss',
      '!**/_*.scss'
    ],
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
