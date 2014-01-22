define([
    'leaflet'
], function (L) {

    L.LegendControl = L.Control.extend({

        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name¬
            var container = L.DomUtil.create('div', 'leaflet-control-background leaflet-control-legendview');

            //_el.className = 'legendView leaflet-control-background';

            var legend = [
                '<h5>Earthquake Age</h5>',
                '<ol class="age-color-legend">',
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

    return L.LegendControl;
});
