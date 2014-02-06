/* global define */
define([
	'mvc/Util',
	'mvc/View'
], function(
	Util,
	View
) {
	'use strict';


	var IDSEQUENCE = 0;


	var ToggleSettingView = function(options) {

		var _settings = options.settings,
		    _key = options.key,
		    _options = options.options,
		    _inputs = {};

		View.call(this, options);


		var getInputChangeCallback = function (input) {
			return function() {
				var existing = _settings.get(_key),
				    toset = {};
				if (typeof existing === 'object') {
					// clone so settings sees change
					existing = Util.extend({}, existing);
					// setting one key in a group of settings
					existing[input.value] = input.checked;
					toset[_key] = existing;
				} else {
					toset[_key] = input.checked;
				}
				_settings.set(toset);
			};
		};

		// build list of options
		var _list = this.el.appendChild(document.createElement('ul'));
		for (var i=0, len=_options.length; i<len; i++) {
			var o = _options[i];

			var li = _list.appendChild(document.createElement('li')),
			    input = document.createElement('input'),
			    label = document.createElement('label');

			input.id = 'togglesettingview-el-' + (++IDSEQUENCE);
			input.type = 'checkbox';
			input.name = _key + '0' + o.id;
			input.value = o.id;
			_inputs[o.id] = input;
			Util.addEvent(input, 'change', getInputChangeCallback(input));

			label.setAttribute('for', input.id);
			// ipad requires this empty attribute for input change to fire
			label.setAttribute('onclick', '');
			label.innerHTML = o.name;

			label.insertBefore(input, label.firstChild);
			li.appendChild(label);
		}


		this.render = function() {
			var existing = _settings.get(_key),
			    id;
			if (typeof existing === 'object') {
				for (id in _inputs) {
					_inputs[id].checked = (existing.hasOwnProperty(id) && existing[id]);
				}
			} else {
				_inputs[_key].checked = existing;
			}
		};


		// when setting changes, update view
		_settings.on('change:' + _key, this.render);
		this.render();
	};



return ToggleSettingView;

});
