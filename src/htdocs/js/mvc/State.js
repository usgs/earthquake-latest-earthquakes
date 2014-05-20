
/* global define */
define([], function() {
	'use strict';


	var State = function(id) {

		// unique identifier for state
		this.id = id;

		// container element
		this._el = document.createElement('section');
		this._el.className = id + '-state';


		// called by application when entering this state
		this.onEnter = function(/*application, lastState*/) {};

		// called by application when leaving this state
		this.onLeave = function(/*application, nextState*/) {};

	};

	return State;

});

