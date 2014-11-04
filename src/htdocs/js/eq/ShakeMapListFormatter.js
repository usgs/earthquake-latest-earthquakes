/* global define */
define ([
	'mvc/DefaultListFormatter',
	'mvc/Util',
	'./Format'
], function(
	DefaultListFormatter,
	Util,
	Format
){
	'use strict';

	var DEFAULTS = {
	};

	var ShakeMapListFormatter = function (options) {
		DefaultListFormatter.apply(this,arguments);

		this._options = Util.extend({}, DEFAULTS, options);
		//Util.addClass(this._el, 'listView');
		this.initialize();
	};


	ShakeMapListFormatter.prototype = {

		initialize: function () {

		},

		generateListItemMarkup: function (items) {
			var markup = [],
			    prefix = this._idprefix,
			    settings = this._options.settings,
			    i, len, item, p, c, className, mmi;

			if (items.length === 0) {
				markup.push('<p class="nodata">No earthquakes to display</p>');
			} else {
				for (i = 0, len = items.length; i < len; i++) {
					item = items[i];
					p = item.properties;
					c = item.geometry.coordinates;
					className = '';

					if (p.mmi !== null) {
						mmi = Format.mmi(p.mmi);

						if (p.mmi >= 600) {
							className = ' class="bigger"';
						} else if (p.mag >= 4.5) {
							className = ' class="big"';
						}

						markup.push(
						'<li id="', prefix, item.id, '"', className, '>',
							'<span class="shakemap-intensity mmi',mmi,'">',
								mmi,
							'</span> ',
							'<span class="place">',
								this._generateListItemTitle(p.type, p.place),
							'</span> ',
							'<span class="time"> ',
								Format.dateFromEvent(item, settings),
							'</span> ',
							'<span class="depth">',
								Format.depth(c[2]),
							' km</span>',
						'</li>');
					}
				}
			}
			this._content.innerHTML = markup.join('');
		}

	};


	return ShakeMapListFormatter;
});
