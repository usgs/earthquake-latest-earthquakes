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
		className: 'dyfi-list'
	};

	var DYFIListFormatter = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
	};

	DYFIListFormatter.prototype.getListClassName = function () {
		return this._options.className;
	};

	DYFIListFormatter.prototype.generateListItemMarkup = function(item) {
		var prefix = this._options.idprefix,
		    settings = this._options.settings,
		    p = item.properties,
		    cdi = Format.mmi(p.cdi),
		    className = '',
		    mmiClassName,
		    responses;

		if (p.felt !== null && p.felt !== 0) {
			mmiClassName = '<span class="intensity mmi' + cdi + '">';

			if (p.felt != 1) {
				responses = p.felt + ' responses';
			} else if (p.felt == 1) {
				responses = p.felt + ' response';
			}
		} else {
			cdi = '&ndash;';
			mmiClassName = '<span class="no-dyfi">';
			responses = '&ndash;';
		}

		if (p.sig >= 600) {
			className = ' class="bigger"';
		} else if (p.mag >= 4.5) {
			className = ' class="big"';
		}

		return '<li id="' + prefix + item.id + '"' + className + '>' +
				mmiClassName +
					cdi +
				'</span> ' +
				'<span class="place">' +
					p.title +
				'</span> ' +
				'<span class="time"> ' +
					Format.dateFromEvent(item, settings) +
				'</span> ' +
				'<span class="responses">' +
					responses +
				'</span>' +
			'</li>';
	};

	return DYFIListFormatter;
});
