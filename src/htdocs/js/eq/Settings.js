/* global define */
define([
	'mvc/Util',
	'mvc/Events',
	'eq/TransitionView',
	'eq/UrlManager'
], function(
	Util,
	Events,
	TransitionView,
	UrlManager
) {
	'use strict';


	var Settings = function(options) {

		var _options = Util.extend({}, options);
		var _storageKey = null;
		var _defaults = {};
		var _current = {};

		Events.call(this);

		/**
		 * Constructor
		 * Called when a new instance is initialized.
		 *
		 * @param options {Object}
		 *      Configuration options. Primarily consists of the following:
		 *      {
		 *           'storageKey'     : String,
		 *           'defaults': Object
		 *      }
		 */
		var _initialize = function() {
			if (typeof(_options.storageKey) !== 'string') {
				throw new Error('Settings requires a "storageKey" string.');
			}
			_storageKey = _options.storageKey;
			if (typeof(_options.defaults) !== 'object') {
				throw new Error('Settings requires a "defaults" object.');
			}

			_defaults = Util.extend({}, _options.defaults);
			_current = Util.extend({}, _defaults, _load());
		};

		/**
		 * API Method
		 *
		 * Extends the current settings with values found in the given settings.
		 * The _current settings are then serialized to a string and placed into
		 * localStorage.
		 *
		 * @param settings {Object}
		 *      The settings with which to extend the _current settings.
		 */
		this.set = function(settings, options) {
			// detect changes
			var changed = {},
			    anyChanged = false,
			    c;

			for (c in settings) {
				if (!_current.hasOwnProperty(c) ||
						!Util.equals(_current[c], settings[c])) {
					changed[c] = settings[c];
					anyChanged = true;
				}
			}

			if (!anyChanged && !(options && options.hasOwnProperty('force') &&
					options.force)) {
				return;
			}

			// persist changes
			_current = Util.extend(_current, settings);
			if (!(options && options.hasOwnProperty('ninja') && options.ninja)) {
				// only update the hash when not in ninja mode
				_save();
			}

			if (options && options.hasOwnProperty('silent') && options.silent) {
				// don't trigger any events
				return;
			}

			// trigger events based on changes
			if (options && options.hasOwnProperty('force') && options.force) {
				// forcing. trigger changes for all specified settings
				for (c in settings) {
					this.trigger('change:' + c, settings[c]);
				}
			} else {
				// not forcing. only notify what actually changed.
				for (c in changed) {
					// events specific to a property
					this.trigger('change:' + c, changed[c]);
				}
			}

			// Only override if format is not already specified
			if (this.get('listFormat') === 'default' && settings.search) {
				var params = settings.search.params;

				// search for producttype and settings listFormat is not default
				if (params.hasOwnProperty('producttype') &&
					  params.producttype === 'dyfi' ||
					  params.producttype === 'shakemap' ||
					  params.producttype === 'losspager') {

					var producttype = params.producttype;
					this.set({'listFormat': producttype});
				}
			}
			// generic event for any change
			this.trigger('change');
		};

		/**
		 * API Method
		 *
		 * Fetches the value for the _current setting associated with the specified
		 * key. If no key is given, return a copy of all _current settings.
		 *
		 * @param key {String|NULL}
		 *      The key for which to fetch the _current setting value.
		 */
		this.get = function(key) {
			if (typeof(key) === 'undefined') {
				return _current;
			}
			if (_current.hasOwnProperty(key)) {
				return _current[key];
			}
			return null;
		};

		/**
		 * API Method
		 *
		 * Resets the _current settings with the defaults provided at time of
		 * instantiation. The new _current settings should then be serialized and
		 * stored into localStorage. It is important that _only_ the default
		 * settings remain in the _current settings and in the localStorage.
		 */
		this.reset = function(options) {
			this.set(_defaults, options);
			if (!(options && options.silent)) {
				this.trigger('reset', 'Default Settings Restored');
			}
		};

		// load settings from url
		var _load = function() {
			var preferences = null;

			try {
				preferences = localStorage.getItem(_storageKey);
			} catch (e) { /* Ignore */}

			// If still using localStorage, migrate
			if (preferences !== null) {
				try {
					preferences = JSON.parse(preferences);

					// Migrate the user's saved searches and default settings
					(new TransitionView(preferences)).show();

					// Purge local storage
					localStorage.removeItem(_storageKey);

					if (window.location.hash !== '') {
						// User has settings in URL as well. This means a user who has not
						// yet migrated to use bookmarks has clicked a shared link that
						// contains a hash. Prefer settings from the hash.
						return UrlManager.parseUrl(window.location.toString());
					} else {
						// Standard migration. Load up user's previous default settings.
						return preferences;
					}
				} catch (e) { /* Ignore */ }
			}

			return UrlManager.parseUrl(window.location.toString());
		};

		// save settings to local storage
		// return true if successful, false otherwise
		var _save = function() {
			try {
				UrlManager.setHash(_current);
				return true;
			} catch (e) {
				return false;
			}
		};

		_initialize();
	};

	return Settings;
});
