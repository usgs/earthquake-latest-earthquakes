'use strict';

var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    precss = require('precss');

var config = require('./config');

var postcss = {

  build: {
    options: {
      processors: [
        precss(),
        autoprefixer({'browsers': 'last 2 versions'}) // vendor prefix as needed
      ]
    },
    src: config.src + '/tablist/hazdev-tablist.scss',
    dest: config.build + '/' + config.src + '/hazdev-tablist.css'
  },

  dist: {
    options: {
      processors: [
        cssnano({zindex: false}) // minify
      ]
    },
    src: config.build + '/' + config.src + '/hazdev-tablist.css',
    dest: config.dist + '/hazdev-tablist.css'
  }
};

module.exports = postcss;
