/**
 * A lightweight view class.
 *
 * Primarily manages an element where a view can render its data.
 */
/* global define */
define([
  'mvc/Events'
], function (Events) {
  'use strict';


  /** create a new view. */
  var View = function (options) {
    // make view source of events
    Events.call(this);

    // element where this view is rendered
    this._el = (options && options.hasOwnProperty('el')) ?
        options.el : document.createElement('div');

    // render inside this._el
    //this.render = function () {
    //};
  };

  View.prototype = {
    render: function () {
    }
  };

  // return constructor from closure
  return View;
});
