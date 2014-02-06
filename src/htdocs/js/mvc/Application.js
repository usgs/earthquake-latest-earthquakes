/* global define */
define(['./Util'], function(Util) {
	'use strict';

	var _createEl = function(name, className, parent) {
		var el = document.createElement(name);
		if (className) {
			el.className = className;
		}
		if (parent) {
			parent.appendChild(el);
		}
		return el;
	};


	var Application = function(options) {
		var _this = this,
			_options = Util.extend({
			// default options

				// element where application should create itself
				'el': null,
					// classname of created elements
					'el_classname':      'app-container',
					'header_classname':  'app-header',
					'content_classname': 'app-content',
					'footer_classname':  'app-footer',

				// different states
				'states': {},
				'views': {},

				// state to load automatically (if not null)
				'initialState': null

			}, options),
			_currentState = null,
			// elements
			_el = _createEl('article', _options.el_classname),
			_header = _createEl('header', _options.header_classname, _el),
			_content = _createEl('section', _options.content_classname, _el),
			_footer = _createEl('footer', _options.footer_classname, _el),
			_loading = null;



		// accessors for element, header and footer
		this.getEl = function() { return _el; };
		this.getHeader = function() { return _header; };
		this.getFooter = function() { return _footer; };

		this.getStates = function() { return _options.states; };
		this.getViews = function() { return _options.views; };
		this.getCurrentState = function() { return _currentState; };

        /**
         * Fetches (or conditionally creates) a view indicated by the given
         * name.
         *
         * @param name {String}
         *      The name of the view to fetch.
         */
		this.getView = function (name) {
			if (_options.views.hasOwnProperty(name)) {
				return _options.views[name];
			} else {
				// create on demand
				var view = this.createView(name);
				if (view !== null) {
					_options.views[name] = view;
				}
				return view;
			}
		};

		this.createView = function(/*name*/) {
			return null;
		};

		// method to move between states
		this.setState = function(stateName) {
			// validate stateName
			if (!_options.states.hasOwnProperty(stateName)) {
				// unknown state
				return;
			} else if (_currentState === stateName) {
				// already in state
				return;
			}

			// leave current state
			if (_currentState !== null) {
				_options.states[_currentState].onLeave(_this, stateName);
				Util.empty(_content);
			}

			// enter new state
			var state = _options.states[stateName];
			_content.appendChild(state.el);
			state.onEnter(_this, _currentState);

			// keep track of current state
			_currentState = stateName;
		};


		this.setLoading = function(isLoading) {
			if (_loading === null) {
				_loading = _createEl('aside', 'loading-spinner');
				_loading.innerHTML = [
					'<div>',
						'<img src="', Application.LOADING_SPINNER, '" alt="" width="16" height="16"/> Loading ...',
					'</div>'
				].join('');
			}

			if (isLoading) {
				_el.appendChild(_loading);
			} else {
				Util.detach(_loading);
			}
			return _loading;
		};


		// automatically load initial state, if specified
		if (_options.initialState !== null) {
			this.setState(_options.initialState);
		}

	};



	Application.LOADING_SPINNER = 'data:image/gif;base64,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';



	return Application;

});
