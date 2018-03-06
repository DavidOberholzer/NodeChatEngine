'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _colors = require('material-ui/styles/colors');

var _colorManipulator = require('material-ui/utils/colorManipulator');

var _spacing = require('material-ui/styles/spacing');

var _spacing2 = _interopRequireDefault(_spacing);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = {
    spacing: _spacing2.default,
    fontFamily: 'Roboto, sans-serif',
    borderRadius: 2,
    palette: {
        primary1Color: '#d50000',
        primary2Color: _colors.cyan700,
        primary3Color: '#757575',
        accent1Color: '#1e88e5',
        accent2Color: _colors.grey100,
        accent3Color: '#ff5722',
        textColor: _colors.darkBlack,
        secondaryTextColor: (0, _colorManipulator.fade)(
            _colors.darkBlack,
            0.54
        ),
        alternateTextColor: _colors.white,
        canvasColor: '#FFFFFF',
        borderColor: '#cfd8dc',
        disabledColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.3),
        pickerHeaderColor: _colors.cyan500,
        clockCircleColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.07),
        shadowColor: _colors.fullBlack
    }
};
