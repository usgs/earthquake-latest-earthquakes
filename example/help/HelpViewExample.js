'use strict';

var HelpView = require('help/HelpView');

var helpView,
    markup;

helpView = HelpView();

markup = helpView.helpView();

document.querySelector('#help-view-example').appendChild(markup);
