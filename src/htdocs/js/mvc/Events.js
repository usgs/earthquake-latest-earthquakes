/**
 * A Lightweight event framework, inspired by backbone.
 *
 * Lazily builds indexes to avoid overhead until needed.
 */
define(
	[],
	function() {
// begin closure


		var Events = function() {
			// map of listeners by event type
			var _listeners = {};


			/**
			 * Add an event listener
			 *
			 * @param event {String} event name (singular).  E.g. "reset"
			 * @param callback {Function} function to call when event is triggered.
			 */
			this.on = function(event, callback, context) {
				if (!_listeners.hasOwnProperty(event)) {
					// first listener for event type
					_listeners[event] = [];
				}

				// add listener
				_listeners[event][_listeners[event].length] = {
					"callback": callback,
					"context": context
				};
			};


			/**
			 * Remove an event listener
			 *
			 * Omitting callback clears all listeners for given event.
			 * Omitting event clears all listeners for all events.
			 *
			 * @param event {String} event name to unbind.
			 * @param callback {Function} callback to unbind.
			 */
			this.off = function(event, callback) {
				if (typeof event === "undefined") {
					// removing all listeners on this object
					_listeners = null;
					_listeners = {};
				} else if (typeof callback === "undefined") {
					// removing all listeners for this event
					delete _listeners[event];
				} else {
					// removing specific callback
					for (var i=0, len=_listeners[event].length; i<len; i++) {
						if (_listeners[event][i].callback === callback) {
							_listeners[event] = _listeners[event].slice(i,1);
							// check if last callback of this type
							if (_listeners[event].length == 0) {
								delete _listeners[event];
							}
							// found callback, stop searching
							break;
						}
					}
				}
			};


			/**
			 * Trigger an event
			 *
			 * @param event {String} event name.
			 * @param args {…} variable length arguments after event are passed to listeners.
			 */
			this.trigger = function(event) {
				if (_listeners.hasOwnProperty(event)) {
					var args = Array.prototype.slice.call(arguments, 1);

					for (var i=0, len=_listeners[event].length; i<len; i++) {
						var listener = _listeners[event][i];
						// NOTE: if listener throws exception, this will stop...
						listener.callback.apply(listener.context, args);
					}
				}
			};

		};


		// make Events a global event source
		Events.call(Events);


		// intercept window.onhashchange events, or simulate if browser doesn't support, and send to global Events object
		var _onHashChange = function(e) {
			Events.trigger("hashchange", e);
		};
		// courtesy of http://stackoverflow.com/questions/9339865/get-the-hashchange-event-to-work-in-all-browsers-including-ie7
		if (!('onhashchange' in window)) {
			var oldHref = document.location.hash;
			setInterval(function() {
			//console.log("hashchange interval");
				if (oldHref !== document.location.hash) {
					oldHref = document.location.hash;
					_onHashChange({
						'type': 'hashchange',
						'newURL': document.location.hash,
						'oldURL': oldHref
					});
				}
			}, 300);
		} else if (window.addEventListener) {
			window.addEventListener("hashchange", _onHashChange, false);
		} else if (window.attachEvent) {
			window.attachEvent("onhashchange", _onHashChange);
		}


		// return constructor from closure
		return Events;
// end closure
	}
);
