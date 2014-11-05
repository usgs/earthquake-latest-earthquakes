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
		    p = item.properties,
		    cdi = Format.mmi(p.cdi),
		    className = '',
		    felt = p.felt,
		    mmiSpan,
		    responses;

		if (felt !== null && felt !== 0) {
			mmiSpan = '<span class="intensity mmi' + cdi + '">';

			if (felt != 1) {
				responses = ' responses'
			} else if (felt == 1) {
				responses = ' response';
			}
		} else {
			cdi = '&ndash;';
			felt = '';
			mmiSpan = '<span class="no-dyfi">';
			responses = '&ndash;';
		}

		if (p.sig >= 600) {
			className = ' class="bigger"';
		} else if (p.mag >= 4.5) {
			className = ' class="big"';
		}
		console.log(p);
		return [
			'<li id="', prefix, item.id, '"', className, '>',
				mmiSpan,
					cdi,
				'</span> ',
				'<span class="place">',
					p.title,
				'</span> ',
				'<span class="time"> ',
					Format.dateFromEvent(item, settings),
				'</span> ',
				'<span class="responses">',
					felt,
				responses, '</span>',
			'</li>'
		].join('');
	};

	return DYFIListFormatter;
});
