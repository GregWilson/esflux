'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _class;

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Flux = require('./Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _Listenable = require('./Listenable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A component that is wired on Airflux or Reflux stores.
 */

var FluxConnection = (0, _Flux2.default)(_class = (function (_Component) {
    _inherits(FluxConnection, _Component);

    function FluxConnection(props) {
        _classCallCheck(this, FluxConnection);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FluxConnection).call(this, props));

        var stores = props.stores;
        Object.keys(props.stores).forEach(function (key) {
            return _this.listenTo(stores[key], key);
        });
        return _this;
    }

    _createClass(FluxConnection, [{
        key: '_injectStores',
        value: function _injectStores(component) {
            return _react2.default.cloneElement(component, this.state);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (_react2.default.Children.count(this.props.children) === 0) {
                return this._injectStores(_react2.default.Children.only(this.props.children));
            } else {
                return _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.Children.map(this.props.children, function (child) {
                        return _this2._injectStores(child);
                    })
                );
            }
        }
    }]);

    return FluxConnection;
})(_react.Component)) || _class;

exports.default = FluxConnection;