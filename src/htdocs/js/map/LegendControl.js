/* global L */
'use strict';


/**
 * Legend Control for latest earthquakes map.
 */
var LegendControl = L.Control.extend({
  options:{
    position: 'bottomright'
  },

  /**
   * Creates a control, to later be added to the map.
   */
  onAdd: function (/* map */) {
    var container;

    // create the control container with a particular class name¬
    container = L.DomUtil.create(
      'div',
      'legend-control'
    );

    container.innerHTML = [
      '<h5 class="legend-control-header">Earthquake Age</h5>',
      '<ol class="no-style legend-control-list">',
        '<li class="legend-control-item">',
          '<span class="color-bar eq-age-hour"></span>',
          'Hour',
        '</li>',
        '<li class="legend-control-item">',
          '<span class="color-bar eq-age-day"></span>',
          'Day',
        '</li>',
        '<li class="legend-control-item">',
          '<span class="color-bar eq-age-week"></span>',
          'Week',
        '</li>',
        '<li class="legend-control-item">',
          '<span class="color-bar eq-age-month"></span>',
          'Older',
        '</li>',
      '</ol>'
    ].join('');

    return container;
  }
});


L.Control.LegendControl = LegendControl;

L.control.legendControl = function (options) {
  return new LegendControl(options);
};

module.exports = L.control.legendControl;
