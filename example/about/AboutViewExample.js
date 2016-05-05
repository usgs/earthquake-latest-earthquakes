'use strict';

var AboutView = require('about/AboutView');

var aboutView;

aboutView = AboutView({
  el: document.querySelector('#about-view-example')
}).render();
