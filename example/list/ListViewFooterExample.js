'use strict';

var ListViewFooter = require('list/ListViewFooter');

var listViewFooterView,
    markup;

listViewFooterView = ListViewFooter();

markup = listViewFooterView.listFooterMarkup();

document.querySelector('#list-view-footer-example').appendChild(markup);
