/* global define */
define([
	'leaflet'
], function(L) {
	'use strict';


    // Digits used in ArcCache tile index for URLs
    var RCDIGITS = 8;

    var DEFAULTS = L.Util.extend({},
        L.TileLayer.prototype.options,
        {
            'name': 'Convenience Layer',
            'url': '',
            'attribution': '',
            'subdomains': '1234',
            'reuseTiles': true
        }
    );

    var _arcZoom = function (zoom) {
        var z = zoom;
        if (zoom < 10) {
            z = '0' + z;
        }
        return 'L' + z;
    };

    var _arcColumn = function (column) {
        return 'C' + _toPaddedHex(column, RCDIGITS);
    };

    var _arcRow = function (row) {
        return 'R' + _toPaddedHex(row, RCDIGITS);
    };

    var _toPaddedHex = function (num, width) {
        var hex = parseInt(num, 10).toString(16);

        while (hex.length < width) {
            hex = '0' + hex;
        }

        return hex;
    };

    /**
     * Example for how to add custom sources by zoom level. Never uncomment
     * this section in this file as it would make _all_ leaflet maps
     * NatGeo.
sources: [
    {
        "zoom": 0,
        "url": "/basemap/tiles/natgeo_hires/{z}/{y}/{x}.jpg",
        "format": "ArcCache"
    },
    {
        "zoom": 9,
        "url": "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
        "format": null
    }
]
    */

    var SimpleAbstractLayer = L.TileLayer.extend({
        options: DEFAULTS,

        /**
         * Wraps the default initialize method so that users need not specify
         * the URL or options. Default configuration provided by this class.
         *
         * @constructor
         *
         * @param _url {String|Object} Optional. Default: DEFAULTS.url
         *      If given a string, used as the URL for the tiles.
         *      If given an object, used as the TileLayer "options".
         *      If null, not used. Fall back on DEFAULTS.url
         *
         * @param _options {Object} Optional. Default: DEFAULTS
         *      If given an object, used as the TileLayer "options".
         *      If null, not used. Fall back on DEFAULTS.
         */
        initialize: function (_url, _options) {
            var url = null, options = null;

            if (_options !== null && typeof _options !== 'undefined') {
                // Two-argument version
                url = _url;
                options = _options;
            } else {
                if (_url !== null && typeof _url !== 'undefined') {
                    // One-argument version.
                    if (typeof _url === 'object') {
                        // Options specified.
                        options = L.Util.extend({}, this.options, _url);
                        url = options.url;
                    } else if (typeof _url === 'string') {
                        // URL specified.
                        url = _url;
                        options = {};
                    }
                } else {
                    url = this.options.url;
                }
            }

            // Call parent constructor
            L.TileLayer.prototype.initialize.apply(this, [url, options]);
        },

        getName: function () {
            return this.options.name;
        },

        getLink: function () {
            return this.options.link;
        },

        getTileUrl: function (tilePoint) {
            var subdomains = this.options.subdomains,
                index = Math.abs((tilePoint.x+tilePoint.y))%subdomains.length,
                s = subdomains[index],

                z = this._getZoomForUrl(),
                x = tilePoint.x,
                y = tilePoint.y,
                numX = Math.pow(2, z),

                format = this.options.format,
                url = this._url;

            // Wrap date line
            while (x < 0) { x += numX; }
            x = x % numX;

            if (this.options.hasOwnProperty('sources')) {
                // find last source that is not for a zoom level deeper than
                // current
                var source = null;
                for (var i=0, len=this.options.sources.length; i<len; i++) {
                    var src = this.options.sources[i];
                    if (src.zoom > z) {
                        break;
                    } else {
                        source = src;
                    }
                }

                if (source !== null) {
                    url = source.url || url;
                    format = source.format || format;
                }
            }

            // now format url
            if (format === 'ArcCache') {
                // use arc hex x y z formatting
                return L.Util.template(url, L.Util.extend({
                        s: s,
                        z: _arcZoom(z),
                        x: _arcColumn(x),
                        y: _arcRow(y)
                    }, this.options));
            } else {
                // use regular x y z formatting
                return L.Util.template(url, L.Util.extend({
                        s: s,
                        z: z,
                        x: x,
                        y: y
                    }, this.options));
            }
        }
    });

    return SimpleAbstractLayer;
});
