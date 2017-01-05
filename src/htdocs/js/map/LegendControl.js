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
    var container,
        legend;

    // create the control container with a particular class name¬
    container = L.DomUtil.create(
      'div',
      'legend-control'
    );

    container.innerHTML = [
    '<div class="legend-container hide">',
      '<button class="expand-button" alt="expand">show legend</button>',
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


L.Control.LegendControl = LegendControl;

L.control.legendControl = function (options) {
  return new LegendControl(options);
};

module.exports = L.control.legendControl;
