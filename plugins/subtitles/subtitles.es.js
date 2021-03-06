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

var SettingOptionItem = videojs.getComponent('SettingOptionItem');

var SubtitleSettingMenuItem = /*#__PURE__*/function (_SettingOptionItem) {
  _inheritsLoose(SubtitleSettingMenuItem, _SettingOptionItem);

  function SubtitleSettingMenuItem(player, options) {
    var _this;

    _this = _SettingOptionItem.call(this, player, _extends({}, options, {
      name: 'SubtitleSettingMenuItem',
      label: 'Subtitles',
      icon: 'vjs-icon-subtitles',
      entries: player.options_.subtitles || []
    })) || this;

    _this.addClass('vjs-setting-subtitles');

    player.on('subtitles', function (_, subtitles) {
      var close = true;
      var entries = subtitles.map(function (val, index) {
        close = !close || !val["default"];
        return _extends({}, val, {
          value: index
        });
      });

      _this.setEntries([].concat(entries, [{
        label: 'Close Subtitles',
        value: -1,
        "default": close
      }]));

      _this.show();
    });
    player.on('subtitlechange', function (_, _ref) {
      var index = _ref.index;

      if (index === -1) {
        // close subtitles
        index = _this.entries.length - 1;
      }

      _this.select(index);

      _this.update(index);
    });
    return _this;
  }

  var _proto = SubtitleSettingMenuItem.prototype;

  _proto.onChange = function onChange(_ref2) {
    var value = _ref2.value;
    this.player_.subtitles().pick(value);
  };

  return SubtitleSettingMenuItem;
}(SettingOptionItem);

videojs.getComponent('SettingMenuButton').prototype.options_.entries.push('SubtitleSettingMenuItem');
videojs.registerComponent('SubtitleSettingMenuItem', SubtitleSettingMenuItem);

var subtitles = /*#__PURE__*/function (_videojs$getPlugin) {
  _inheritsLoose(subtitles, _videojs$getPlugin);

  function subtitles(player, options) {
    var _this;

    _this = _videojs$getPlugin.call(this, player, options) || this;
    _this.flag = null;
    _this.track = null;
    var timeout;

    var handleSubtitleChangeEvent = function handleSubtitleChangeEvent() {
      clearTimeout(timeout);

      var subtitles = _this.values();

      var currentSubtitle = subtitles.find(function (t) {
        return t.mode === 'showing';
      }) || {};
      var newFlag = currentSubtitle.label || currentSubtitle.id || -1; // multiple `change` event will reveiced when subtitles changed ( depends on number of subtitles or browser ? )
      // so that timeout is used to make sure `subtitlechange` event emit once;

      timeout = setTimeout(function () {
        if (_this.flag !== newFlag) {
          _this.flag = newFlag;
          player.trigger('subtitlechange', {
            index: subtitles.indexOf(currentSubtitle),
            label: currentSubtitle.label || ''
          });
        }
      }, 10);
    };

    player.textTracks().on('change', handleSubtitleChangeEvent);
    player.on('dispose', function () {
      player.textTracks().off('change', handleSubtitleChangeEvent);
    });
    return _this;
  }

  var _proto = subtitles.prototype;

  _proto.values = function values() {
    var tracks = this.player.textTracks();
    var subtitles = [];

    for (var i = 0; i < tracks.length; i++) {
      if (tracks[i].kind === 'subtitles') {
        subtitles.push(tracks[i]);
      }
    }

    return subtitles;
  };

  _proto.load = function load(subtitles_) {
    if (subtitles_ === void 0) {
      subtitles_ = [];
    }

    var player = this.player;

    if (subtitles_ && subtitles_.length) {
      this.remove();
      var index = -1;
      var trackEls = [];

      var _subtitles = subtitles_.map(function (s, i) {
        var subtitle = Object.assign({}, s);
        var manualCleanup = true; // set default to false, otherwise subtitle will reset to the default subtitle
        // when user switch quality with quality plugin

        var trackEl = player.addRemoteTextTrack(_extends({}, subtitle, {
          "default": false
        }), manualCleanup);
        trackEl.track.mode = 'hidden';
        trackEls.push(trackEl);

        if (index === -1 && subtitle["default"] === true) {
          index = i;
        } else {
          subtitle["default"] = false;
        }

        return subtitle;
      });

      if (index !== -1) {
        this.flag = _subtitles[index].label;
        this.track = trackEls[index].track;
        this.track.mode = 'showing';
      }

      player.trigger('subtitles', _subtitles);
    }

    return this;
  };

  _proto.remove = function remove() {
    var _this2 = this;

    this.values().forEach(function (track) {
      _this2.player.removeRemoteTextTrack(track);
    });
    return this;
  };

  _proto.pick = function pick(index) {
    var subtitles = this.values();
    var newTrack = subtitles[index];

    if (newTrack) {
      if (this.track) {
        this.track.mode = 'disabled';
      }

      this.track = newTrack;
      this.track.mode = 'showing';
    } else if (this.track) {
      this.track.mode = 'disabled';
    }

    return this;
  };

  return subtitles;
}(videojs.getPlugin('plugin'));

videojs.hook('setup', function (vjsPlayer) {
  vjsPlayer.ready(function () {
    var subtitles = vjsPlayer.options_.subtitles;
    subtitles && subtitles.length && vjsPlayer.subtitles().load(subtitles);
  });
});
videojs.registerPlugin('subtitles', subtitles);
//# sourceMappingURL=subtitles.es.js.map
