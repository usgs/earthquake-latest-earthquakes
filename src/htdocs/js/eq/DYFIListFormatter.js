/* global define */
define([
	'mvc/Util',
	'./Format'
], function (
	Util,
	Format
) {
	'use strict';

	var DEFAULTS = {
	};

	var DYFIListFormatter = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
	};

	DYFIListFormatter.prototype.getListClassName = function () {
		return 'dyfi-list';
	};

	DYFIListFormatter.prototype.generateListItemMarkup = function(item) {
		var prefix = this._options.idprefix,
		    settings = this._options.settings,
		    p,
		    cdi,
		    className,
		    plural;

		p = item.properties;

		if (p.felt !== null && p.felt !== 0) {
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

			return [
				'<li id="', prefix, item.id, '"', className, '>',
					'<span class="intensity mmi', cdi, '">',
						cdi,
					'</span> ',
					'<span class="place">',
						this._generateListItemTitle(p.mag, p.type, p.place),
					'</span> ',
					'<span class="time"> ',
						Format.dateFromEvent(item, settings),
					'</span> ',
					'<span class="responses">',
						p.felt,
					' response', plural, '</span>',
				'</li>'
			].join('');
		} else {
			return [
				'<li id="', prefix, item.id, '"', className, '>',
					'<span class="no-dyfi">',
						'&ndash;',
					'</span> ',
					'<span class="place">',
						this._generateListItemTitle(p.mag, p.type, p.place),
					'</span> ',
					'<span class="time"> ',
						Format.dateFromEvent(item, settings),
					'</span> ',
					'<span class="responses">',
						p.felt,
					' response', plural, '</span>',
				'</li>'
			].join('');
		}
	};

	DYFIListFormatter.prototype._generateListItemTitle =
			function (mag, type, place) {

		mag = 'M ' + Format.magnitude(mag) + ' - ';

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
	};

	return DYFIListFormatter;
});
