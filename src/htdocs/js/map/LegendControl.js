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
      '<div class="legend-control-item">',
        '<h5>Magnitude</h5>',
        '<ol class="magnitude-legend">',
          '<li class="earthquake-marker eq-type-eq eq-mag-0"></li>',
          '<li class="earthquake-marker eq-type-eq eq-mag-1"></li>',
          '<li class="earthquake-marker eq-type-eq eq-mag-2"></li>',
          '<li class="earthquake-marker eq-type-eq eq-mag-3"></li>',
          '<li class="earthquake-marker eq-type-eq eq-mag-4"></li>',
          '<li class="earthquake-marker eq-type-eq eq-mag-5"></li>',
          '<li class="earthquake-marker eq-type-eq eq-mag-6"></li>',
          '<li class="earthquake-marker eq-type-eq eq-mag-7"></li>',
        '</ol>',
      '</div>',
      '<div class="legend-control-item">',
        '<h5>Age (past)</h5>',
        '<ol class="age-legend">',
          '<li>',
            '<span class="earthquake-marker eq-age-hour"></span>',
            '<span>Hour</span>',
          '</li>',
          '<li>',
            '<span class="earthquake-marker eq-age-day"></span>',
            '<span>Day</span>',
          '</li>',
          '<li>',
            '<span class="earthquake-marker eq-age-week"></span>',
            '<span>Week</span>',
          '</li>',
          '<li>',
            '<span class="earthquake-marker eq-age-month"></span>',
            '<span>Month</span>',
          '</li>',
          '<li>',
            '<span class="earthquake-marker eq-age-older"></span>',
            '<span>Older</span>',
          '</li>',
        '</div>'
    ].join('');

    return container;
  }
});


L.Control.LegendControl = LegendControl;

L.control.legendControl = function (options) {
  return new LegendControl(options);
};

module.exports = L.control.legendControl;
