/* global define */
define([
	'mvc/Util',
	'mvc/View'
], function (Util, View) {
	'use strict';


	var IDSEQUENCE = 0;

	var SettingView = function (options) {
		// Extend mvc/View
		View.call(this, options);

		this.settings = options.settings;
		this.key = options.key;
		this.options = options.options;
		this.inputs = {};

		this.list = this.el.appendChild(document.createElement('ul'));
		this.list.className = 'settinglist';

		this._createView();

		// When setting changes, update view
		if (typeof this.options ===  'function') {
			this.settings.on('change:' + this.key, (function (view) {
				return function () {
					SettingView.prototype._createView.apply(view, arguments);
				};
			})(this));
		} else {
			this.settings.on('change:' + this.key, (function (view) {
				return function () {
					SettingView.prototype.render.apply(view, arguments);
				};
			})(this));
		}
	};

	// For inheritance to work better.

	SettingView.prototype = {

		// ----------------------------------------------------------------------
		// Public methods
		// ----------------------------------------------------------------------

		render: function () {
			// update based on current selected
			var selected = this.settings.get(this.key);

			if (this.inputs.hasOwnProperty(selected)) {
				this.inputs[selected].checked = true;
			}
		},

		// ----------------------------------------------------------------------
		// "Private" methods
		// ----------------------------------------------------------------------

		_createView: function () {
			var i, len, options;

			// Get options
			if (typeof this.options === 'function') {
				options = this.options();
			} else {
				options = this.options || [];
			}

			Util.empty(this.list);

			for (i = 0, len = options.length; i < len; i++) {
				this.list.appendChild(this._createItem(options[i]));
			}

			// Select current feed. (or try to)
			this.render();
		},

		_createItem: function (option) {
			var item = document.createElement('li'),
			    input = document.createElement('input'),
			    label = document.createElement('label');

			input.id = 'settingview-el-' + (++IDSEQUENCE);
			input.type = 'radio';
			input.name = this.key;
			input.value = option.id;
			this.inputs[option.id] = input;

			Util.addEvent(input, 'change', (function (input, view) {
				return function() {
					var toset = {};
					toset[view.key] = input.value;
					view.settings.set(toset);
				};
			})(input, this));

			label.setAttribute('for', input.id);
			// ipad requires this empty attribute for input change to fire
			label.setAttribute('onclick', '');
			label.innerHTML = option.name;

			label.insertBefore(input, label.firstChild);
			item.appendChild(label);

			return item;
		}
	};

	return SettingView;

});
