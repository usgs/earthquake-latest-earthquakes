define([
    'mvc/Events'
], function (Events) {

    // do this check once, instead of once per call
    var supportsClassList = false,
        supportsAddEventListener = false,
        supportsDateInput = false,
        isMobile = false;


    // static object with utility methods
    var Util = {
        "isMobile": function () {
            return isMobile;
        },
        "supportsDateInput": function () {
            return supportsDateInput;
        },
        /**
         * Merge properties from a series of objects.
         *
         * @param dst {Object} target where merged properties are copied to.
         * @param <variable> {Object} source objects for properties.
         *                   When a source is non null, it's properties are copied to the dst object.
         *                   Properties are copied in the order of arguments:
         *                        a property on a later argument
         *                        overrides a property on an earlier argument.
         */
        "extend": function(dst) {
            // iterate over sources where properties are read
            for (var i=1,len=arguments.length; i<len; i++) {
                var src=arguments[i];
                if (src) {
                    for (var prop in src) {
                        dst[prop] = src[prop];
                    }
                }
            }

            // return updated object
            return dst;
        },

        /**
         * Checks if objects are equal.
         *
         * @param a {Object} Object a.
         * @param b {Object} Object b.
         */
				 /*
        "equals": function(a, b) {
            var p;
            for (p in a) {
                if (b === null || typeof(b[p]) == 'undefined') {
                    return false;
                }
            }

            for (p in a) {
                if (a[p]) {
                    switch (typeof(a[p])) {
                    case 'object':
                        if (!a[p].equals(b[p])) {
                            return false;
                        }
                        break;
                    case 'function':
                        if (
                            (typeof(b[p]) == 'undefined') ||
                            (p != 'equals' && a[p].toString() != b[p].toString())
                        ) {
                            return false;
                        }
                        break;
                    default:
                        if (a[p] != b[p]) {
                            return false;
                        }
                    }
                } else {
                    if (b[p]) {
                        return false;
                    }
                }
            }

            for(p in b) {
                if (a === null || typeof(a[p]) == 'undefined') {
                    return false;
                }
            }

            if (typeof a === 'boolean' && a !== b) {
	            return false;
            }

            return true;
        },
				*/

				equals: function (objA, objB) {
					if (objA === objB) {
						// if === then ===, no question about that...
						return true;
					} else if (objA === null || objB === null) {
						// funny, typeof null === 'object', so ... hmph!
						return false;
					} else if (typeof objA === 'object' && typeof objB === 'object') {
						// recursively check objects
						for (keya in objA) {
							if (objA.hasOwnProperty(keya)) {
								if (!objB.hasOwnProperty(keya)) {
									return false; // objB is missing a key from objA
								}
							}
						}

						for (keyb in objB) {
							if (objB.hasOwnProperty(keyb)) {
								if (!objA.hasOwnProperty(keyb)) {
									return false; // objA is missing a key from objB
								} else if (!Util.equals(objA[keyb], objB[keyb])) {
									return false; // objA[key] !== objB[key]
								}
							}
						}

						return true; // Recursively equal, so equal
					} else {
						return objA === objB; // Use baked in === for primitives
					}
				},

        /**
         * Add a class to an element.
         *
         * @param el the element to modify.
         * @param className the class to add.
         */
        "addClass": function(el, className) {
            if (!el) {
                return;
            } else if (supportsClassList) {
                // html 5
                el.classList.add(className);
            } else {
                // other
                var classes = el.className.split(/\s+/);
                for (var i=0, len=classes.length; i<len; i++) {
                    if (classes[i] === className) {
                        return false;
                    }
                }
                classes.push(className);
                el.className = classes.join(' ');
            }
        },

        /**
         * Remove a class from an element.
         *
         * @param el the element to modify.
         * @param className the class to remove.
         */
        "removeClass": function (el, className) {
            if (!el) {
                return;
            } else if (supportsClassList) {
                // html 5
                el.classList.remove(className);
            } else {
                // other
                var classes = el.className.split(/\s+/);
                for (var i=0, len=classes.length; i<len; i++) {
                    if (classes[i] === className) {
                        classes.splice(i, 1);
                        el.className = classes.join(' ');
                        return true;
                    }
                }
                return false;
            }
        },

        /**
         * Test whether an element has a class.
         *
         * @param el the element to test.
         * @param className the class to find.
         */
        "hasClass": function(el, className) {
            if (!el) {
                return;
            } else if (supportsClassList) {
                // html 5
                return el.classList.contains(className);
            } else {
                // other
                var classes = el.className.split(/\s+/);
                for (var i=0, len=classes.length; i<len; i++) {
                    if (classes[i] === className) {
                        return true;
                    }
                }
            }
        },

        /**
         * Add an event listener to an element.
         *
         * @param el the element.
         * @param eventName the event name (e.g. "click").
         * @param callback the callback function.
         */
        "addEvent": function (el, eventName, callback) {
            if (!el) {
                return;
            } else if (supportsAddEventListener) {
                el.addEventListener(eventName, callback, false);
            } else {
                el.attachEvent("on" + eventName, callback);
            }
        },

        /**
         * Remove an event listener from an element.
         * @param el the element.
         * @param eventName the event name (e.g. "click").
         * @param callback the callback function.
         */
        "removeEvent": function (el, eventName, callback) {
            if (!el) {
                return;
            } else if (supportsAddEventListener) {
                el.removeEventListener(eventName, callback, false);
            } else {
                el.detachEvent("on" + eventName, callback);
            }
        },

        /**
         * Get an event object for an event handler.
         *
         * @param e the event that was received by the event handler.
         * @return {Object} with two properties:
         *         "target" - the element where the event occurred.
         *         "originalEvent" - the event object, either parameter e or window.event (in IE).
         */
        "getEvent": function(e) {
            if (!e) {
                // ie puts event in global
                var e = window.event;
            }
            // find target
            var targ;
            if (e.target) {
                targ = e.target;
            } else if (e.srcElement) {
                targ = e.srcElement;
            }

            // handle safari bug
            if (targ.nodeType === 3) {
                targ = targ.parentNode;
            }

            // return target and event
            return {
                "target": targ,
                "originalEvent": e
            };
        },

        /**
         * Get a parent node based on it's node name.
         *
         * @param el element to search from.
         * @param nodeName node name to search for.
         * @param maxParent element to stop searching.
         * @return matching element, or null if not found.
         */
        "getParentNode": function(el, nodeName, maxParent) {
            var parent = el;
            while (parent && parent !== maxParent && parent.nodeName.toUpperCase() !== nodeName) {
                parent = parent.parentNode;
            }
            if (parent && "nodeName" in parent && parent.nodeName.toUpperCase() === nodeName) {
                // found the desired node
                return parent;
            }
            // didn't find the desired node
            return null;
        },

        // remove an elements child nodes
        "empty": function(el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        },

        // detach an element from its parent
        "detach": function(el) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        },

        "getWindowSize": function() {
            if ("innerWidth" in window && "innerHeight" in window) {
                return {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            } else {
                // probably IE<=8
                var elem = "documentElement" in document ?
                        document.documentElement :
                        document.body;
                return {
                    width: elem.offsetWidth,
                    height: elem.offsetHeight
                };
            }
        },

        /**
         * returns true if array a contains b
         */
        "contains": function(a, b) {
            for (var i = 0; i < a.length; i++) {
                if (b == a[i]) {
                    return true;
                }
            }
            return false;
        },

        /**
         * returns true if object is an array
         */
        "isArray": function(a) {
            if (typeof Array.isArray === 'function') {
            	return Array.isArray(a);
            } else if (a.constructor === Array) {
            	return true;
            }
            return false;
        }
    };

    // Do these checks once and cache the results
    (function() {
        var testEl = document.createElement("div");
        var testInput = document.createElement('input');
        var str = navigator.userAgent||navigator.vendor||window.opera;

        isMobile = str.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i);
        supportsClassList = ("classList" in testEl);
        supportsAddEventListener = ("addEventListener" in testEl);
        testInput.setAttribute('type', 'date');
        supportsDateInput = (testInput.type !== 'text');

        // clean up testing element
        testEl = null;
    })();

    return Util;
});
