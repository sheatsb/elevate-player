/* eslint-disable */
/* VERSION: 1.6.2 */
import videojs from 'video.js';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var logType = '';

try {
  logType = localStorage && localStorage.getItem('vjs-plus-log');
} catch (e) {}

var log = function () {
  if (logType === 'normal' || videojs.browser.IE_VERSION) {
    // log without style
    return console.info.bind(console, '[VJS Plus]:');
  } else if (logType) {
    // log with style
    return console.info.bind(console, '%c[VJS Plus]:', 'font-weight: bold; color:#2196F3;');
  }

  return function () {};
}();

var SettingOptionItem = videojs.getComponent('SettingOptionItem');

var QualityHlsSettingItem = /*#__PURE__*/function (_SettingOptionItem) {
  _inheritsLoose(QualityHlsSettingItem, _SettingOptionItem);

  function QualityHlsSettingItem(player, options) {
    var _this;

    _this = _SettingOptionItem.call(this, player, _extends({}, options, {
      name: 'QualityHlsSettingItem',
      label: 'Quality',
      icon: 'vjs-icon-hd'
    })) || this;

    _this.addClass('vjs-setting-quality');

    _this.levels = [];

    _this.handleAllLevelsAdded();

    return _this;
  }

  var _proto = QualityHlsSettingItem.prototype;

  _proto.handleAllLevelsAdded = function handleAllLevelsAdded() {
    var _this2 = this;

    var player = this.player_;

    if (!player.qualityLevels) {
      log('plugin videojs-contrib-quality-levels do not exsits');
      return false;
    }

    var qualityLevels = player.qualityLevels();
    var levels = [];
    var timeout;
    qualityLevels.on('addqualitylevel', function (_ref) {
      var qualityLevel = _ref.qualityLevel;
      clearTimeout(timeout);
      levels.push(qualityLevel);

      var callback = function callback() {
        _this2.levels = levels.slice(0);
        player.trigger('before-quality-setup', {
          levels: _this2.levels
        });

        _this2.onAllLevelsAdded();

        levels = [];
      };

      timeout = setTimeout(callback, 10);
    });
  };

  _proto.onAllLevelsAdded = function onAllLevelsAdded() {
    var _this3 = this;

    var entries = [].concat(this.levels.map(function (_ref2) {
      var height = _ref2.height;
      return {
        label: _this3.localize(height + "p"),
        value: height,
        "default": false
      };
    }).sort(function (a, b) {
      return b.value - a.value;
    }), [{
      label: 'Auto',
      value: 'auto',
      "default": true
    }]);

    if (this.levels.length > 1) {
      // use auto as default
      this.setEntries(entries, entries.length - 1);
      this.show();
      this.player_.trigger('hls-quality', this.levels);
    } else {
      this.hide();
    }
  };

  _proto.onChange = function onChange(selected) {
    var _this4 = this;

    var value = selected.value;

    _SettingOptionItem.prototype.onChange.call(this, selected);

    this.levels.forEach(function (lv) {
      lv.enabled = lv.height === value || value === 'auto';
    });
    this.player_.trigger('hls-qualitychange', this.entries.reduce(function (acc, entry, index) {
      if (entry.value === value) {
        var level = _this4.levels.find(function (v) {
          return v.height === value;
        }) || {};
        acc = _extends({
          index: index,
          level: level
        }, entry);
      }

      return acc;
    }, {}));
  };

  return QualityHlsSettingItem;
}(SettingOptionItem);

videojs.getComponent('SettingMenuButton').prototype.options_.entries.push('QualityHlsSettingItem');
videojs.registerComponent('QualityHlsSettingItem', QualityHlsSettingItem);
//# sourceMappingURL=quality-hls.es.js.map
