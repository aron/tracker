describe(['jquery', 'vendor/soak'], function () {
  var jQuery = require('jquery'),
      soak = require('soak');

  return soak.inherit(Object, {
    constructor: function Events() {
      this.hub = jQuery({});
    },
    on: function (topic, fn, context) {
      if (context) { fn = jQuery.proxy(fn, context); }
      this.hub.on(topic, fn);
    },
    off: function () {
      this.hub.off.apply(arguments);
    },
    trigger: function (topic) {
      var args = jQuery.makeArray(arguments).slice(1);
      this.hub.trigger(topic, args);
    }
  });
});
