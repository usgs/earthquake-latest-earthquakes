/* global define */
define ([
	'./DefaultListFormatter',
	'mvc/Util',
	'./Format'
], function(
	DefaultListFormatter,
	Util,
	Format
){
	'use strict';

	var ShakeMapListFormatter = function (/*options*/) {
		DefaultListFormatter.apply(this, arguments);
	};

	ShakeMapListFormatter.prototype =
			Object.create(DefaultListFormatter.prototype);


	ShakeMapListFormatter.prototype.getListClassName = function () {
		return 'shakemap-list';
	};

	ShakeMapListFormatter.prototype.generateListItemMarkup = function (item) {
		var markup = [],
		    prefix = this._idprefix,
		    settings = this._options.settings,
		    p, c, className, mmi, mmispan;

		p = item.properties;
		c = item.geometry.coordinates;
		className = '';

		if (p.mmi !== null) {
			mmi = Format.mmi(p.mmi);
			mmispan = 'intensity';
		} else {
			mmi = '&ndash;';
			mmispan = 'no-shakemap';
		}

		if (p.mmi >= 600) {
			className = ' class="bigger"';
		} else if (p.mag >= 4.5) {
			className = ' class="big"';
		}

		markup.push(
		'<li id="', prefix, item.id, '"', className, '>',
			'<span class="',mmispan,' mmi',mmi,'">',
				mmi,
			'</span> ',
			'<span class="place">',
				this._generateListItemTitle(p.mag, p.type, p.place),
			'</span> ',
			'<span class="time"> ',
				Format.dateFromEvent(item, settings),
			'</span> ',
			'<span class="depth">',
				Format.depth(c[2]),
			' km</span>',
		'</li>');

		return markup.join('');
	};

	ShakeMapListFormatter.prototype._generateListItemTitle =
			function (mag, type, place) {

    if (mag !== null) {
      mag = Format.magnitude(mag) + ' - ';
    }

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
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
      }
    }
    return mag + type + ' ' + place;

	};

	return ShakeMapListFormatter;
});
