module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FluxComponent = exports.Joins = exports.Store = exports.Publisher = exports.SyncAction = exports.Action = undefined;

	var _Action2 = __webpack_require__(2);

	var _Action3 = _interopRequireDefault(_Action2);

	var _SyncAction2 = __webpack_require__(6);

	var _SyncAction3 = _interopRequireDefault(_SyncAction2);

	var _Publisher2 = __webpack_require__(3);

	var _Publisher3 = _interopRequireDefault(_Publisher2);

	var _Store2 = __webpack_require__(7);

	var _Store3 = _interopRequireDefault(_Store2);

	var _JoinStores = __webpack_require__(10);

	var _Joins = _interopRequireWildcard(_JoinStores);

	var _FluxComponent2 = __webpack_require__(11);

	var _FluxComponent3 = _interopRequireDefault(_FluxComponent2);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Action = _Action3.default;
	exports.SyncAction = _SyncAction3.default;
	exports.Publisher = _Publisher3.default;
	exports.Store = _Store3.default;
	exports.Joins = _Joins;
	exports.FluxComponent = _FluxComponent3.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _Publisher2 = __webpack_require__(3);

	var _Publisher3 = _interopRequireDefault(_Publisher2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * @abstract
	 */

	var Action = (function (_Publisher) {
	    _inherits(Action, _Publisher);

	    function Action() {
	        _classCallCheck(this, Action);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Action).call(this));

	        _this.children = {};
	        return _this;
	    }

	    _createClass(Action, [{
	        key: 'asyncResult',

	        /**
	         * Transforms the action into one returning an asynchronous result.
	         * This will create two children actions:
	         * - completed
	         * - failed
	         *
	         * If the listen function returns a Promise, the Promise will be automatically mapped onto these two children actions.
	         */
	        value: function asyncResult() {
	            var listenFunction = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];

	            this.children.completed = new Action();
	            Object.defineProperty(this, 'completed', { value: this.children.completed });

	            this.children.failed = new Action();
	            Object.defineProperty(this, 'failed', { value: this.children.failed });

	            if (typeof listenFunction === 'function') {
	                this.listen(listenFunction);
	            }

	            return this;
	        }

	        /**
	         * Creates children actions
	         */

	    }, {
	        key: 'withChildren',
	        value: function withChildren(children) {
	            var _this2 = this;

	            children.forEach(function (child) {
	                if (typeof child === 'string') {
	                    var action = new Action();
	                    _this2.children[child] = action;
	                    Object.defineProperty(_this2, child, { value: action });
	                } else if (Array.isArray(child) && typeof child[0] === 'string' && child[1] instanceof Action) {
	                    var name = child[0];
	                    _this2.children[name] = child[1];
	                    Object.defineProperty(_this2, name, { value: child[1] });
	                }
	            });
	            return this;
	        }

	        /**
	         * Returns a synchronous function to trigger the action
	         */

	    }, {
	        key: '_createFunctor',

	        /**
	         *
	         */
	        value: function _createFunctor(triggerFn) {
	            var _this3 = this;

	            var functor = triggerFn.bind(this);

	            Object.defineProperty(functor, '_isActionFunctor', { value: true });
	            Object.defineProperty(functor, 'action', { value: this });
	            Object.defineProperty(functor, 'listen', { value: function value(fn, bindCtx) {
	                    return Action.prototype.listen.call(_this3, fn, bindCtx);
	                } });
	            Object.defineProperty(functor, 'listenOnce', { value: function value(fn, bindCtx) {
	                    return Action.prototype.listenOnce.call(_this3, fn, bindCtx);
	                } });

	            Object.keys(this.children).forEach(function (childName) {
	                Object.defineProperty(functor, childName, { value: _this3.children[childName].asFunction });
	            });

	            return functor;
	        }
	    }, {
	        key: 'sync',
	        get: function get() {
	            return false;
	        }
	    }, {
	        key: 'asSyncFunction',
	        get: function get() {
	            return this._createFunctor(this.triggerSync);
	        }

	        /**
	        * Returns a function to trigger the action, async or sync depending on the action definition.
	         */

	    }, {
	        key: 'asFunction',
	        get: function get() {
	            return this._createFunctor(this.canHandlePromise() ? this.triggerPromise : this.trigger);
	        }
	    }, {
	        key: 'eventType',
	        get: function get() {
	            return 'event';
	        }
	    }, {
	        key: 'isAction',
	        get: function get() {
	            return true;
	        }
	    }]);

	    return Action;
	})(_Publisher3.default);

	exports.default = Action;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _utils = __webpack_require__(4);

	var _ = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @constructor
	 */

	var Publisher = (function () {

	    /**
	     * @protected
	     */

	    function Publisher() {
	        _classCallCheck(this, Publisher);

	        this.emitter = new _.EventEmitter();
	        //this.children = [];
	        this._dispatchPromises = [];
	    }
	    //children           : Array< any >;

	    _createClass(Publisher, [{
	        key: 'preEmit',

	        /**
	         * Hook used by the publisher that is invoked before emitting
	         * and before `shouldEmit`. The arguments are the ones that the action
	         * is invoked with. If this function returns something other than
	         * undefined, that will be passed on as arguments for shouldEmit and
	         * emission.
	         */
	        value: function preEmit() {}

	        /**
	         * Hook used by the publisher after `preEmit` to determine if the
	         * event should be emitted with given arguments. This may be overridden
	         * in your application, default implementation always returns true.
	         *
	         * @returns {Boolean} true if event should be emitted
	         */

	    }, {
	        key: 'shouldEmit',
	        value: function shouldEmit() {
	            return true;
	        }

	        /**
	         * Subscribes the given callback for action triggered
	         *
	         * @param {Function} callback The callback to register as event handler
	         * @param {Mixed} [optional] bindContext The context to bind the callback with
	         * @returns {Function} Callback that unsubscribes the registered event handler
	         */

	    }, {
	        key: 'listen',
	        value: function listen(callback, bindContext) {
	            var _this = this;

	            var aborted = false;
	            bindContext = bindContext || this;

	            var eventHandler = function eventHandler(args) {
	                if (aborted) {
	                    // This state is achieved when one listener removes another.
	                    //   It might be considered a bug of EventEmitter2 which makes
	                    //   a snapshot of the listener list before looping through them
	                    //   and effectively ignores calls to removeListener() during emit.
	                    // TODO: Needs a test.
	                    return;
	                }

	                var result = callback.apply(bindContext, args);

	                if (_.isPromise(result)) {
	                    // Note: To support mixins, we need to access the method this way.
	                    //   Overrides are not possible.
	                    //

	                    var canHandlePromise = _this.canHandlePromise();
	                    if (!canHandlePromise) {
	                        console.warn('Unhandled promise for ' + _this.eventType);
	                        return;
	                    }

	                    _this._dispatchPromises.push({
	                        promise: result,
	                        listener: callback
	                    });
	                }
	            };
	            this.emitter.addListener(this.eventType, eventHandler);

	            return function () {
	                aborted = true;
	                _this.emitter.removeListener(_this.eventType, eventHandler);
	            };
	        }
	    }, {
	        key: 'listenOnce',
	        value: function listenOnce(callback, bindContext) {
	            var _arguments = arguments;

	            bindContext = bindContext || this;
	            var unsubscribe = this.listen(function () {
	                var args = Array.prototype.slice.call(_arguments);
	                unsubscribe();
	                return callback.apply(bindContext, args);
	            });
	            return unsubscribe;
	        }

	        /**
	         * Attach handlers to promise that trigger the completed and failed
	         * child publishers, if available.
	         *
	         * @param {Object} The promise to attach to
	         */
	        /*    promise( promise: Promise ) {
	                var canHandlePromise : boolean =
	                    this.children.indexOf('completed') >= 0 &&
	                    this.children.indexOf('failed') >= 0;
	        
	                if( !canHandlePromise ){
	                    throw new Error('Publisher must have "completed" and "failed" child publishers');
	                }
	        
	                promise.then( ( response ) => this.completed.asFunction( response ) )
	                       .catch( ( error ) => this.failed.asFunction( error ) );
	            }*/

	        /**
	         * Attach handlers to promise that trigger the completed and failed
	         * child publishers, if available.
	         *
	         * @param {Object} promise The result to use or a promise to which to listen.
	         */
	        // TODO: MOVE TO ACTION
	        // as calling completed and failed is completely specific to an action, this should be moved to the Action class.

	    }, {
	        key: 'resolve',
	        value: function resolve(promise) {
	            var _this2 = this;

	            var canHandlePromise = this.canHandlePromise();
	            if (!canHandlePromise) {
	                throw new Error('Not an async publisher');
	            }

	            if (!_.isPromise(promise)) {
	                this.completed.asFunction(promise);
	                return;
	            }

	            return promise.then(function (response) {
	                return _this2.completed.asFunction(response);
	            }, function (error) {
	                return _this2.failed.asFunction(error);
	            });
	        }
	    }, {
	        key: 'reject',
	        value: function reject(result) {
	            if (_.isPromise(result)) {
	                console.warn('Use #resolve() for promises.');
	                return;
	            }

	            this.failed(result);
	        }
	    }, {
	        key: 'then',
	        value: function then(onSuccess, onFailure) {
	            var canHandlePromise = this.canHandlePromise();
	            if (!canHandlePromise) {
	                throw new Error('Not an async publisher');
	            }

	            if (onSuccess) {
	                this.completed.listenOnce(onSuccess);
	            }
	            if (onFailure) {
	                this.failed.listenOnce(onFailure);
	            }
	        }
	    }, {
	        key: 'catch',
	        value: function _catch(onFailure) {
	            this.then(null, onFailure);
	        }
	    }, {
	        key: 'canHandlePromise',
	        value: function canHandlePromise() {
	            return !!this.completed && !!this.failed; // && this.completed._isActionFunctor && this.failed._isActionFunctor;
	        }

	        /**
	         * Publishes an event using `this.emitter` (if `shouldEmit` agrees)
	         */

	    }, {
	        key: 'triggerSync',
	        value: function triggerSync() {
	            var args = arguments;
	            var preResult = this.preEmit.apply(this, args);
	            if (typeof preResult !== 'undefined') {
	                args = _.isArguments(preResult) ? preResult : [].concat(preResult);
	            }

	            if (this.shouldEmit.apply(this, args)) {
	                this._dispatchPromises = [];
	                this.emitter.emit(this.eventType, args);

	                this._handleDispatchPromises();
	            }
	        }

	        /**
	         * Tries to publish the event on the next tick
	         */

	    }, {
	        key: 'trigger',
	        value: function trigger() {
	            var _this3 = this;

	            var args = arguments;
	            _.nextTick(function () {
	                return _this3.triggerSync.apply(_this3, args);
	            });
	        }

	        /**
	         * Returns a Promise for the triggered action
	         */

	    }, {
	        key: 'triggerPromise',
	        value: function triggerPromise() {
	            var _this4 = this;

	            var canHandlePromise = this.canHandlePromise();
	            if (!canHandlePromise) {
	                throw new Error('Publisher must have "completed" and "failed" child publishers');
	            }

	            var args = arguments;

	            var promise = new Promise(function (resolve, reject) {
	                var removeSuccess = _this4.completed.listen(function (args) {
	                    removeSuccess();
	                    removeFailed();
	                    resolve(args);
	                });

	                var removeFailed = _this4.failed.listen(function (args) {
	                    removeSuccess();
	                    removeFailed();
	                    reject(args);
	                });

	                _this4.trigger.apply(_this4, args);
	            });

	            return promise;
	        }

	        /**
	         * @private
	         */

	    }, {
	        key: '_handleDispatchPromises',
	        value: function _handleDispatchPromises() {
	            var promises = this._dispatchPromises;
	            this._dispatchPromises = [];

	            if (promises.length === 0) {
	                return;
	            }
	            if (promises.length === 1) {
	                return this.resolve(promises[0].promise);
	            }

	            var mappedPromises = promises.map(function (item) {
	                return item.promise.then(function (result) {
	                    return {
	                        listener: item.listener,
	                        value: result
	                    };
	                });
	            });

	            var joinedPromise = Promise.all(mappedPromises);
	            return this.resolve(joinedPromise);
	        }
	    }, {
	        key: 'eventType',
	        get: function get() {
	            return 'event';
	        }
	    }, {
	        key: 'isPublisher',
	        get: function get() {
	            return true;
	        }
	    }]);

	    return Publisher;
	})();

	exports.default = Publisher;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/*
	 * isObject, extend, isFunction, isArguments are taken from undescore/lodash in
	 * order to remove the dependency
	 */
	var isObject = exports.isObject = function (obj) {
	    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	    return type === 'function' || type === 'object' && !!obj;
	};

	exports.isFunction = function (value) {
	    return typeof value === 'function';
	};

	exports.isPromise = function (value) {
	    return value && ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function') && typeof value.then === 'function';
	};

	exports.EventEmitter = __webpack_require__(5);

	exports.nextTick = function (callback) {
	    setTimeout(callback, 0);
	};

	exports.capitalize = function (string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	};

	exports.callbackName = function (string) {
	    return "on" + exports.capitalize(string);
	};

	exports.object = function (keys, vals) {
	    var o = {},
	        i = 0;
	    for (; i < keys.length; i++) {
	        o[keys[i]] = vals[i];
	    }
	    return o;
	};

	exports.isArguments = function (value) {
	    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && 'callee' in value && typeof value.length === 'number';
	};

	exports.throwIf = function (val, msg) {
	    if (val) {
	        throw Error(msg || val);
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	var prefix = typeof Object.create !== 'function' ? '~' : false;

	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} once Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }

	/**
	 * Holds the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;

	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events && this._events[evt];

	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];

	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }

	  return ee;
	};

	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events || !this._events[evt]) return false;

	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;

	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Functon} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }

	  return this;
	};

	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }

	  return this;
	};

	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events || !this._events[evt]) return this;

	  var listeners = this._events[evt]
	    , events = [];

	  if (fn) {
	    if (listeners.fn) {
	      if (
	           listeners.fn !== fn
	        || (once && !listeners.once)
	        || (context && listeners.context !== context)
	      ) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (
	             listeners[i].fn !== fn
	          || (once && !listeners[i].once)
	          || (context && listeners[i].context !== context)
	        ) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }

	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }

	  return this;
	};

	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;

	  if (event) delete this._events[prefix ? prefix + event : event];
	  else this._events = prefix ? {} : Object.create(null);

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _Action2 = __webpack_require__(2);

	var _Action3 = _interopRequireDefault(_Action2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SyncAction = (function (_Action) {
	    _inherits(SyncAction, _Action);

	    function SyncAction() {
	        _classCallCheck(this, SyncAction);

	        return _possibleConstructorReturn(this, Object.getPrototypeOf(SyncAction).call(this, true));
	    }

	    _createClass(SyncAction, [{
	        key: 'sync',
	        get: function get() {
	            return true;
	        }
	    }, {
	        key: 'asFunction',
	        get: function get() {
	            return this._createFunctor(this.triggerSync);
	        }
	    }]);

	    return SyncAction;
	})(_Action3.default);

	exports.default = SyncAction;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _Listener2 = __webpack_require__(8);

	var _Listener3 = _interopRequireDefault(_Listener2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 */

	var Store = (function (_Listener) {
	    _inherits(Store, _Listener);

	    function Store() {
	        _classCallCheck(this, Store);

	        return _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this));
	    }

	    _createClass(Store, [{
	        key: 'publishState',

	        /**
	         * Publishes the state to all subscribers.
	         * This ensures that the stores always publishes the same data/signature.
	         */
	        value: function publishState() {
	            _get(Object.getPrototypeOf(Store.prototype), 'trigger', this).call(this, this.state);
	        }
	    }, {
	        key: 'setState',
	        value: function setState() {
	            var transform = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	            if (!!transform) {
	                this.state = transform(this.state);
	            }

	            _get(Object.getPrototypeOf(Store.prototype), 'trigger', this).call(this, this.state);
	        }
	    }, {
	        key: 'eventType',
	        get: function get() {
	            return 'change';
	        }
	    }]);

	    return Store;
	})(_Listener3.default);

	exports.default = Store;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _utils = __webpack_require__(4);

	var _ = _interopRequireWildcard(_utils);

	var _Publisher2 = __webpack_require__(3);

	var _Publisher3 = _interopRequireDefault(_Publisher2);

	var _Join = __webpack_require__(9);

	var _Join2 = _interopRequireDefault(_Join);

	var _Action = __webpack_require__(2);

	var _Action2 = _interopRequireDefault(_Action);

	var _Store = __webpack_require__(7);

	var _Store2 = _interopRequireDefault(_Store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * A module of methods related to listening.
	 * @constructor
	 * @extends {Publisher}
	 */

	var Listener = (function (_Publisher) {
	    _inherits(Listener, _Publisher);

	    function Listener() {
	        _classCallCheck(this, Listener);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Listener).call(this));

	        _this.subscriptions = [];
	        return _this;
	    }

	    /**
	     * An internal utility function used by `validateListening`
	     *
	     * @param {Action|Store} listenable The listenable we want to search for
	     * @returns {Boolean} The result of a recursive search among `this.subscriptions`
	     */

	    _createClass(Listener, [{
	        key: 'hasListener',
	        value: function hasListener(listenable) {
	            var subs = this.subscriptions || [];
	            for (var i = 0; i < subs.length; ++i) {
	                var listenables = [].concat(subs[i].listenable);
	                for (var j = 0; j < listenables.length; ++j) {
	                    var listener = listenables[j];
	                    if (listener === listenable) {
	                        return true;
	                    }
	                    if (listener.hasListener && listener.hasListener(listenable)) {
	                        return true;
	                    }
	                }
	            }
	            return false;
	        }

	        /**
	         * A convenience method that listens to all listenables in the given object.
	         *
	         * @param {Object} listenables An object of listenables. Keys will be used as callback method names.
	         */

	    }, {
	        key: 'listenToMany',
	        value: function listenToMany(listenables) {
	            var allListenables = flattenListenables(listenables);
	            for (var key in allListenables) {
	                var cbname = _.callbackName(key);
	                // $FlowComputedProperty
	                var localname = this[cbname] ? cbname : this[key] ? key : undefined;
	                if (localname) {
	                    var callback =
	                    // $FlowComputedProperty
	                    this[cbname + 'Default'] ||
	                    // $FlowComputedProperty
	                    this[localname + 'Default'] || localname;
	                    this.listenTo(allListenables[key], localname, callback);
	                }
	            }
	        }

	        /**
	         * Checks if the current context can listen to the supplied listenable
	         *
	         * @param {Action|Store} listenable An Action or Store that should be
	         *  listened to.
	         * @returns {String|Undefined} An error message, or undefined if there was no problem.
	         */

	    }, {
	        key: 'validateListening',
	        value: function validateListening(listenable) {
	            if (listenable === this) {
	                return 'Listener is not able to listen to itself';
	            }
	            if (!_.isFunction(listenable.listen)) {
	                return listenable + ' is missing a listen method';
	            }
	            if (listenable.hasListener && listenable.hasListener(this)) {
	                return 'Listener cannot listen to this listenable because of circular loop';
	            }
	        }

	        /**
	         * Sets up a subscription to the given listenable for the context object
	         *
	         * @param {Action|Store} listenable An Action or Store that should be
	         *  listened to.
	         * @param {Function|String} callback The callback to register as event handler
	         * @param {Function|String} defaultCallback The callback to register as default handler
	         * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is the object being listened to
	         */
	        // TODO: deprecate the callback being a string

	    }, {
	        key: 'listenTo',
	        value: function listenTo(listenable, callback, defaultCallback) {
	            _.throwIf(this.validateListening(listenable));

	            if (!!defaultCallback) this.fetchInitialState(listenable, defaultCallback);

	            var subs = this.subscriptions;
	            // $FlowComputedProperty
	            var desub = listenable.listen(this[callback] || callback, this);
	            var unsubscriber = function unsubscriber() {
	                var index = subs.indexOf(subscriptionObj);
	                _.throwIf(index === -1, 'Tried to remove listen already gone from subscriptions list!');
	                subs.splice(index, 1);
	                desub();
	            };

	            var subscriptionObj = {
	                stop: unsubscriber,
	                listenable: listenable
	            };
	            subs.push(subscriptionObj);
	            return subscriptionObj;
	        }

	        /**
	         * Stops listening to a single listenable
	         *
	         * @param {Action|Store} listenable The action or store we no longer want to listen to
	         * @returns {Boolean} True if a subscription was found and removed, otherwise false.
	         */

	    }, {
	        key: 'stopListeningTo',
	        value: function stopListeningTo(listenable) {
	            var subs = this.subscriptions || [];

	            // TODO: use lodash array find or something
	            for (var i = 0; i < subs.length; ++i) {
	                var sub = subs[i];
	                if (sub.listenable === listenable) {
	                    sub.stop();
	                    _.throwIf(subs.indexOf(sub) !== -1, 'Failed to remove listen from subscriptions list!');
	                    return true;
	                }
	            }
	            return false;
	        }

	        /**
	         * Adds a subscription
	         */

	    }, {
	        key: 'addSubscription',
	        value: function addSubscription(subscription) {
	            this.subscriptions.push(subscription);
	        }

	        /**
	         * Removes a subscription
	         */

	    }, {
	        key: 'removeSubscription',
	        value: function removeSubscription(subscription) {
	            for (var i = 0; i < this.subscriptions.length; ++i) {
	                if (this.subscriptions[i] === subscription) {
	                    this.subscriptions.splice(i, 1);
	                    return true;
	                }
	            }
	        }

	        /**
	         * Stops all subscriptions and empties subscriptions array
	         */

	    }, {
	        key: 'stopListeningToAll',
	        value: function stopListeningToAll() {
	            var subs = this.subscriptions || [];
	            var remaining;
	            while (remaining = subs.length) {
	                subs[0].stop();
	                _.throwIf(subs.length !== remaining - 1, 'Failed to remove listen from subscriptions list!');
	            }
	        }

	        /**
	         * Used in `listenTo`. Fetches initial data from a publisher if it has a `state` getter.
	         * @param {Action|Store} listenable The publisher we want to get initial state from
	         * @param {Function|String} defaultCallback The method to receive the data
	         */
	        // TODO: deprecate the callback being a string

	    }, {
	        key: 'fetchInitialState',
	        value: function fetchInitialState(listenable, defaultCallback) {
	            //const callback: Function = typeof defaultCallback === 'string' ? this[defaultCallback] : defaultCallback;
	            if (typeof defaultCallback === 'string') {
	                // $FlowComputedProperty
	                defaultCallback = this[defaultCallback];
	            }

	            var self = this;
	            if (_.isFunction(defaultCallback) && listenable.state) {
	                var data = listenable.state;
	                if (data && _.isFunction(data.then)) {
	                    data.then(function () {
	                        defaultCallback.apply(self, arguments);
	                    });
	                } else {
	                    defaultCallback.call(this, data);
	                }
	            }
	        }

	        /**
	         * The callback will be called once all listenables have triggered at least once.
	         * It will be invoked with the last emission from each listenable.
	         * @param {Function} callback The method to call when all publishers have emitted
	         * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
	         */

	    }, {
	        key: 'joinTrailing',
	        value: function joinTrailing(callback) {
	            for (var _len = arguments.length, listenables = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                listenables[_key - 1] = arguments[_key];
	            }

	            return this._createJoin('last', callback, listenables);
	        }

	        /**
	         * The callback will be called once all listenables have triggered at least once.
	         * It will be invoked with the first emission from each listenable.
	         * @param {...Publishers} publishers Publishers that should be tracked.
	         * @param {Function|String} callback The method to call when all publishers have emitted
	         * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
	         */

	    }, {
	        key: 'joinLeading',
	        value: function joinLeading(callback) {
	            for (var _len2 = arguments.length, listenables = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                listenables[_key2 - 1] = arguments[_key2];
	            }

	            return this._createJoin('first', callback, listenables);
	        }

	        /**
	         * The callback will be called once all listenables have triggered at least once.
	         * It will be invoked with all emission from each listenable.
	         * @param {...Publishers} publishers Publishers that should be tracked.
	         * @param {Function|String} callback The method to call when all publishers have emitted
	         * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
	         */

	    }, {
	        key: 'joinConcat',
	        value: function joinConcat(callback) {
	            for (var _len3 = arguments.length, listenables = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	                listenables[_key3 - 1] = arguments[_key3];
	            }

	            return this._createJoin('all', callback, listenables);
	        }

	        /**
	         * The callback will be called once all listenables have triggered.
	         * If a callback triggers twice before that happens, an error is thrown.
	         * @param {...Publishers} publishers Publishers that should be tracked.
	         * @param {Function|String} callback The method to call when all publishers have emitted
	         * @returns {Object} A subscription obj where `stop` is an unsub function and `listenable` is an array of listenables
	         */

	    }, {
	        key: 'joinStrict',
	        value: function joinStrict(callback) {
	            for (var _len4 = arguments.length, listenables = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
	                listenables[_key4 - 1] = arguments[_key4];
	            }

	            return this._createJoin('strict', callback, listenables);
	        }
	    }, {
	        key: '_createJoin',
	        value: function _createJoin(strategy, callback, listenables) {
	            var _this2 = this;

	            _.throwIf(listenables.length < 2, 'Cannot create a join with less than 2 listenables!');

	            // validate everything
	            listenables.forEach(function (listenable) {
	                return _.throwIf(_this2.validateListening(listenable));
	            });

	            var stop = new _Join2.default(listenables, strategy).listen(callback);

	            var subobj = {
	                listenable: listenables,
	                stop: (function (_stop) {
	                    function stop() {
	                        return _stop.apply(this, arguments);
	                    }

	                    stop.toString = function () {
	                        return _stop.toString();
	                    };

	                    return stop;
	                })(function () {
	                    stop();
	                    _this2.removeSubscription(subobj);
	                })
	            };

	            this.subscriptions.push(subobj);

	            return subobj;
	        }
	    }]);

	    return Listener;
	})(_Publisher3.default);

	/**
	 * Extract child listenables from a parent from their
	 * children property and return them in a keyed Object
	 *
	 * @param {Object} listenable The parent listenable
	 */

	exports.default = Listener;
	var mapChildListenables = function mapChildListenables(listenable) {
	    var children = {};

	    var childListenables = listenable.children || [];
	    for (var i = 0; i < childListenables.length; ++i) {
	        var childName = childListenables[i];
	        if (listenable[childName]) {
	            children[childName] = listenable[childName];
	        }
	    }

	    return children;
	};

	/**
	 * Make a flat dictionary of all listenables including their
	 * possible children (recursively), concatenating names in camelCase.
	 *
	 * @param {Object} listenables The top-level listenables
	 */
	var flattenListenables = function flattenListenables(listenables) {
	    var flattened = {};
	    for (var key in listenables) {
	        var listenable = listenables[key];
	        var childMap = mapChildListenables(listenable);

	        // recursively flatten children
	        var children = flattenListenables(childMap);

	        // add the primary listenable and chilren
	        flattened[key] = listenable;
	        for (var childKey in children) {
	            var childListenable = children[childKey];
	            flattened[key + _.capitalize(childKey)] = childListenable;
	        }
	    }

	    return flattened;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _Publisher = __webpack_require__(3);

	var _Publisher2 = _interopRequireDefault(_Publisher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var slice = Array.prototype.slice;

	var Join = (function () {
	    function Join(listenables, strategy) {
	        _classCallCheck(this, Join);

	        this._args = [];
	        this._listenablesEmitted = [];

	        this._listenables = listenables;
	        this._strategy = strategy;
	        this._reset();
	    }

	    _createClass(Join, [{
	        key: "_reset",
	        value: function _reset() {
	            this._listenablesEmitted = new Array(this.count);
	            this._args = new Array(this.count);
	        }
	    }, {
	        key: "listen",
	        value: function listen(callback) {
	            var _this = this;

	            var cancels = this._listenables.map(function (listenable, i) {
	                return listenable.listen(_this._newListener(i), _this);
	            });
	            this._callback = callback;

	            return function () {
	                return cancels.forEach(function (cancel) {
	                    return cancel();
	                });
	            };
	        }
	    }, {
	        key: "_newListener",
	        value: function _newListener(i) {
	            return function () {
	                var callargs = slice.call(arguments);
	                if (this._listenablesEmitted[i]) {
	                    switch (this._strategy) {
	                        case "strict":
	                            throw new Error("Strict join failed because listener triggered twice.");
	                        case "last":
	                            this._args[i] = callargs;break;
	                        case "all":
	                            this._args[i].push(callargs);
	                    }
	                } else {
	                    this._listenablesEmitted[i] = true;
	                    this._args[i] = this._strategy === "all" ? [callargs] : callargs;
	                }

	                this._emitIfAllListenablesEmitted();
	            };
	        }
	    }, {
	        key: "_emitIfAllListenablesEmitted",
	        value: function _emitIfAllListenablesEmitted() {
	            for (var i = 0; i < this.count; ++i) {
	                if (!this._listenablesEmitted[i]) {
	                    return;
	                }
	            }

	            this._callback.apply(null, this._args);
	            this._reset();
	        }
	    }, {
	        key: "count",
	        get: function get() {
	            return this._listenables.length;
	        }
	    }]);

	    return Join;
	})();

	exports.default = Join;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.joinStrict = joinStrict;
	exports.joinLeading = joinLeading;
	exports.all = all;
	exports.joinTrailing = joinTrailing;
	exports.joinConcat = joinConcat;

	var _Store = __webpack_require__(7);

	var _Store2 = _interopRequireDefault(_Store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function joinClassFactory(strategy) {
	    var store = new _Store2.default();

	    // TODO: when flow supports :: syntax, switch to it
	    // $FlowComputedProperty

	    for (var _len = arguments.length, listenables = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        listenables[_key - 1] = arguments[_key];
	    }

	    store[strategy].apply(store, [store.trigger.bind(store)].concat(listenables));
	    return store;
	}

	function joinStrict() {
	    return joinClassFactory.apply(undefined, ['joinStrict'].concat(Array.prototype.slice.call(arguments)));
	};
	function joinLeading() {
	    return joinClassFactory.apply(undefined, ['joinLeading'].concat(Array.prototype.slice.call(arguments)));
	};
	function all() {
	    return joinClassFactory.apply(undefined, ['joinTrailing'].concat(Array.prototype.slice.call(arguments)));
	};
	function joinTrailing() {
	    return joinClassFactory.apply(undefined, ['joinTrailing'].concat(Array.prototype.slice.call(arguments)));
	};
	function joinConcat() {
	    return joinClassFactory.apply(undefined, ['joinConcat'].concat(Array.prototype.slice.call(arguments)));
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = FluxComponent;

	var _Listener = __webpack_require__(8);

	var _Listener2 = _interopRequireDefault(_Listener);

	var _Publisher = __webpack_require__(3);

	var _Publisher2 = _interopRequireDefault(_Publisher);

	var _Store = __webpack_require__(7);

	var _Store2 = _interopRequireDefault(_Store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function FluxComponent(target) {
	    var clazz = target.prototype;

	    /**
	     * Wrap the componentDidMount with our own.
	     * We will start listening to every action once the component is mounted.
	     */
	    var orgComponentDidMount = clazz.componentDidMount;
	    clazz.componentDidMount = function () {
	        var _this = this;

	        if (!!orgComponentDidMount) orgComponentDidMount.call(this);

	        this.__listener = this.__listener || new _Listener2.default();
	        this.__publishers.forEach(function (pub) {
	            return _this.__listenToPublisher(pub.publisher, pub.callback);
	        });
	        this.__stores.forEach(function (st) {
	            return _this.__listenToStore(st.store, st.stateKey);
	        });
	    };

	    /**
	     * Wrap the componentWillMount with our own.
	     * For store connections, we set the value of the state before the first render.
	     * After that, it will be done through setState
	     */
	    var orgComponentWillMount = clazz.componentWillMount;
	    clazz.componentWillMount = function () {
	        var _this2 = this;

	        this.state = this.state || {};
	        this.__publishers = this.__publishers || [];
	        this.__stores = this.__stores || [];

	        this.__stores.forEach(function (st) {
	            return _this2.state[st.stateKey] = st.store.state;
	        });
	        if (!!orgComponentWillMount) orgComponentWillMount.call(this);
	    };

	    /**
	     * Wrap the componentWillMount with our own.
	     * Stops listening to every subscriptions.
	     */
	    var orgComponentWillUnmount = clazz.componentWillUnmount;
	    clazz.componentWillUnmount = function () {
	        if (!!this.__listener) this.__listener.stopListeningToAll();
	        if (!!orgComponentWillUnmount) orgComponentWillUnmount.call(this);
	    };

	    /**
	     * Starts listening to a store.
	     * The state of the store will be connected to the state of the componentWillUnmount
	     * @param  {Store} store
	     * @param  {string} stateKey
	     */
	    clazz.__listenToStore = function (store, stateKey) {
	        var _this3 = this;

	        this.__listener.listenTo(store, function (value) {
	            return _this3.setState(_defineProperty({}, stateKey, value));
	        });
	    };

	    clazz.__listenToPublisher = function (publisher, callback) {
	        var $this = this;

	        this.__listener.listenTo(publisher, function () {
	            callback.apply($this, arguments);
	        });
	    };

	    /**
	     * Connects the component to a store.
	     *
	     * @param  {Store} store        the store to listen to
	     * @param  {string} stateKey    the key in the state of the component where the state of the store will be put
	     */
	    clazz.connectStore = function (store, stateKey) {
	        this.__stores = this.__stores || [];
	        this.__stores.push({ store: store, stateKey: stateKey });
	    };

	    /**
	     * Listens to an action or store, and calls a callback everytime.
	     * @param  {Publiser} publisher
	     * @param  {Function} callback
	     */
	    clazz.listenTo = function (publisher, callback) {
	        this.__publishers = this.__publishers || [];
	        this.__publishers.push({ publisher: publisher, callback: callback });
	    };
	}

/***/ }
/******/ ]);