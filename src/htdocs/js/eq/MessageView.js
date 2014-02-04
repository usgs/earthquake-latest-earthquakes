define(["mvc/Util", "mvc/View"], function(Util, View) {


	var MessageView = function(options) {

		View.call(this);
		this.el.className = 'messageView';

		// container for messages
		var _list = this.el.appendChild(document.createElement('ol'));


		/**
		 * Add a message to the list.
		 *
		 * @param message - html markup as string.
		 * @param timeout - milliseconds to leave visible
		 *                  if omitted, or less than zero, wait for user to click close.
		 * @param className - class of container element.
		 */
		this.addMessage = function(message, timeout, className) {
			// message list item
			var _el = _list.insertBefore(document.createElement('li'), _list.firstChild);
			_el.innerHTML = message;
			if (className) {
				_el.className = className;
			}

			var _timeout = null;

			// callback to remove message
			var _remove = function() {
				if (_timeout !== null) {
					clearTimeout(_timeout);
					_timeout = null;
				}
				Util.detach(_el);
			};

			var _close = _el.appendChild(document.createElement('a'));
			_close.className = 'close-link';
			_close.innerHTML = 'x';
			Util.addEvent(_close, 'click', _remove);

			if (timeout && timeout > 0) {
				_timeout = setTimeout(_remove, timeout);
			}

			// return message handle to caller so they can remove
			return {
				el: _el,
				remove: _remove
			};

		};

	};


	return MessageView;

});

