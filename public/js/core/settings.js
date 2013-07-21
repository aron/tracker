define(function () {
  return {
    extract: function (element) {
      var settings = {};

      var meta = element.querySelectorAll('[data-setting]');

      return [].reduce.call(meta, function (settings, item) {
        settings[item.name] = item.content;
        return settings;
      }, {});
    }
  };
});
