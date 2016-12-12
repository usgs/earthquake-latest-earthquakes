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
      'scenario-legend-control'
    );

    container.innerHTML = [
      '<h5>Magnitude</h5>',
      '<ol class="zoomedout scenario-marker-sizes">',
        '<li class="earthquake-marker eq-type-eq eq-mag-0"></li>',
        '<li class="earthquake-marker eq-type-eq eq-mag-1"></li>',
        '<li class="earthquake-marker eq-type-eq eq-mag-2"></li>',
        '<li class="earthquake-marker eq-type-eq eq-mag-3"></li>',
        '<li class="earthquake-marker eq-type-eq eq-mag-4"></li>',
        '<li class="earthquake-marker eq-type-eq eq-mag-5"></li>',
        '<li class="earthquake-marker eq-type-eq eq-mag-6"></li>',
        '<li class="earthquake-marker eq-type-eq eq-mag-7"></li>',
      '</ol>',
      '<h5>Intensity (MMI)</h5>',
      '<ol class="scenario-intensity-colors">',
        '<li class="mmiI">I</li>',
        '<li class="mmiII">II</li>',
        '<li class="mmiIII">III</li>',
        '<li class="mmiIV">IV</li>',
        '<li class="mmiV">V</li>',
        '<li class="mmiVI">VI</li>',
        '<li class="mmiVII">VII</li>',
        '<li class="mmiVIII">VIII</li>',
        '<li class="mmiIX">IX</li>',
        '<li class="mmiX">X</li>',
        '<li class="mmiXI">XI</li>',
        '<li class="mmiXII">XII</li>',
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
