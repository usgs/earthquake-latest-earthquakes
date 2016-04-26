'use strict';

var HelpView = require('help/HelpView');

var helpView;

helpView = HelpView({
  el: document.querySelector('#help-view-example')
}).render();
