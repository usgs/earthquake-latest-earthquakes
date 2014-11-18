/* global define */
define([
	'mvc/Util',
	'./Format',
	'./DefaultListFormatter'
], function (
	Util,
	Format,
	DefaultListFormatter
) {
	'use strict';

	var DEFAULTS = {};

	var DYFIListFormatter = function (options) {
		this._options = Util.extend({}, DEFAULTS, options);
	};

	DYFIListFormatter.prototype = Object.create(DefaultListFormatter.prototype);

	DYFIListFormatter.prototype.getListClassName = function () {
		return this._options.className;
	};

	DYFIListFormatter.prototype.generateListItemMarkup = function(item) {
		var prefix = this._options.idprefix,
		    settings = this._options.settings,
		    p = item.properties,
		    cdi = p.cdi,
		    className = '',
		    felt = p.felt,
		    mmiClass,
		    responses;

		if (felt !== null) {
			cdi = Format.mmi(p.cdi);
			mmiClass = 'intensity mmi' + cdi;

			if (felt !== 1) {
				responses = felt + ' responses';
			} else {
				responses = felt + ' response';
			}
		} else {
			cdi = '&ndash;';
			mmiClass = 'no-dyfi';
			responses = '&ndash; responses';
		}

		if (p.sig >= 600) {
			className = ' class="bigger"';
		} else if (p.mag >= 4.5) {
			className = ' class="big"';
		}

		return '<li id="' + prefix + item.id + '"' + className + '>' +
				'<span class="' + mmiClass + '">' +
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
