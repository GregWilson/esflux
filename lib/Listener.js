'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _utils = require('./utils');

var _ = _interopRequireWildcard(_utils);

var _Publisher2 = require('./Publisher');

var _Publisher3 = _interopRequireDefault(_Publisher2);

var _Join = require('./Join');

var _Join2 = _interopRequireDefault(_Join);

var _Action = require('./Action');

var _Action2 = _interopRequireDefault(_Action);

var _Store = require('./Store');

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