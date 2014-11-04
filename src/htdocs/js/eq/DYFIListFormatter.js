/* global define */
define([
	'mvc/View',
	'mvc/Util',
	'./Format'
], function (
	View,
	Util,
	Format
) {
	'use strict';


	var DEFAULTS = {
	};

	var SEQUENCE = 0;

	var DYFIListFormatter = function (options) {
		View.apply(this, arguments);

		this._options = Util.extend({}, DEFAULTS, options);
		this._idprefix = 'dyfilistview-' + (++SEQUENCE) + '-';
		this._lastDataRender = null;

		Util.addClass(this._el, 'dyfiListView');
		this.initialize();
		this._bindEvents();
	};

	// Extend the base View with custom methods and state
	DYFIListFormatter.prototype = {

		_generateListMarkup: function (items) {
			var markup = [],
			    prefix = this._idprefix,
			    settings = this._options.settings,
			    i,
			    len,
			    item,
			    p,
			    cdi,
			    className,
			    plural,
			    dyfiCount;

			if (items.length === 0) {
				markup.push('<p class="nodata">No earthquakes to display</p>');
			} else {
				dyfiCount = 0;
				for (i = 0, len = items.length; i < len; i++) {
					item = items[i];
					p = item.properties;

					if (p.felt !== null && p.felt !== 0) {
						dyfiCount += 1;
						cdi = Format.mmi(p.cdi);
						className = '';
						plural = '';

						if (p.felt > 1) {
							plural = 's';
						}

						if (p.sig >= 600) {
							className = ' class="bigger"';
						} else if (p.mag >= 4.5) {
							className = ' class="big"';
						}

						markup.push(
						'<li id="', prefix, item.id, '"', className, '>',
							'<span class="dyfi-intensity mmi', cdi, '">',
								cdi,
							'</span> ',
							'<span class="place">',
								this._generateListItemTitle(p.mag, p.type, p.place),
							'</span> ',
							'<span class="time"> ',
								Format.dateFromEvent(item, settings),
							'</span> ',
							'<span class="dyfi-responses">',
								p.felt,
							' response', plural, '</span>',
						'</li>');
					}
				}
				if (dyfiCount < 1) {
					markup.push('<p class=nodata">No DYFI reports to display</p>');
				}
			}
			this._content.innerHTML = markup.join('');
		},

		_generateListItemTitle: function (mag, type, place) {
			var mag = 'M ' + Format.magnitude(mag) + ' - ';
			if (type === null || type.toLowerCase() === 'earthquake') {
				return mag + place;
			} else {
				type = type.toLowerCase();
				if (type === 'quarry') {
					type = 'Quarry Blast';
				} else if (type === 'nuke') {
					type = 'Nuclear Explosion';
				} else if (type === 'rockfall') {
					type = 'Rockslide';
				} else if (type === 'rockburst') {
					type = 'Rockslide';
				} else if (type === 'sonicboom') {
					type = 'Sonic Boom';
				} else {
					type = type.replace(/\w\S*/g,
							function (txt) {
								return mag + txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
							}
					);
				}
			}
			return mag + type + ' ' + place;
		}

	};

	// return constructor from closure
	return DYFIListFormatter;
});
