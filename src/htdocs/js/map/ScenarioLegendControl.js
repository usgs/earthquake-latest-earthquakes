/* global L */
'use strict';


/**
 * Scenario Legend Control for latest earthquakes map.
 */
var ScenarioLegendControl = L.Control.extend({
  options:{
    position: 'bottomright'
  },

  /**
   * Creates a control, to later be added to the map.
   */
  onAdd: function (/* map */) {
    var container,
        legend;

    // create the control container with a particular class name¬
    container = L.DomUtil.create(
      'div',
      'legend-control'
    );

    container.innerHTML = [
      '<div class="legend-container hide">',
        '<div class="legend-control-item hide">',
          '<button class="expand-button" alt="expand">show legend</button>',
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
          '<h5>Intensity (MMI)</h5>',
          '<ol class="intensity-legend">',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiI"></span>',
              '<span>I</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiII"></span>',
              '<span>II</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiIII"></span>',
              '<span>III</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiIV"></span>',
              '<span>IV</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiV"></span>',
              '<span>V</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiVI"></span>',
              '<span>VI</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiVII"></span>',
              '<span>VII</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiVIII"></span>',
              '<span>VIII</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiIX"></span>',
              '<span>IX</span>',
            '</li>',
            '<li>',
              '<span class="earthquake-marker eq-type-eq mmiX"></span>',
              '<span>X+</span>',
            '</li>',
          '</ol>',
        '</div>',
        '<div class="legend-container-message">',
          '<div class="collapsed">show legend</div>',
          '<div class="expanded">hide legend</div>',
        '</div>',
      '</div>'
    ].join('');

    legend = container.querySelector('.legend-container');
    legend.addEventListener('click', function () {
      if (this.classList.contains('hide')) {
        this.classList.remove('hide');
        this.classList.add('show');
      } else {
        this.classList.remove('show');
        this.classList.add('hide');
      }
    });

    return container;
  }
});


L.Control.scenarioLegendControl = ScenarioLegendControl;

L.control.scenarioLegendControl = function (options) {
  return new ScenarioLegendControl(options);
};

module.exports = L.control.scenarioLegendControl;
