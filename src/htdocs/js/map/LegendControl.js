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
    // create the control container with a particular class name¬
    var container = L.DomUtil.create(
        'div',
        'leaflet-control-background leaflet-control-legendview');

    var legend = [
      '<h5>Earthquake Age</h5>',
      '<ol class="age-color-legendView">',
      '<li><span class="color-bar eq-age-hour"></span>Hour</li>',
      '<li><span class="color-bar eq-age-day"></span>Day</li>',
      '<li><span class="color-bar eq-age-week"></span>Week</li>',
      '<li><span class="color-bar eq-age-month"></span>Older</li>',
      '</ol>'
    ];
    container.innerHTML = legend.join('');

    return container;
  }

});

module.exports = LegendControl;
