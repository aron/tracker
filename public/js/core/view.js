define(['core/events', 'vendor/soak', 'jquery'], function () {
  var jQuery = require('jquery'),
      soak = require('vendor/soak'),
      Events = require('core/events');

  return soak.inherit(Events, {
    constructor: function View(element, options) {
      Events.apply(this, arguments);
      this.el = element || document.createElement('div');
      this.$el = jQuery(element);
      this.options = soak.mixin({}, this.constructor.options, options);
      this.addEvents(this.constructor.events || {});
    },
    render: function () {
      return this.el;
    },
    remove: function () {
      this.$remove();
    },
    addEvents: function (events) {
      Object.keys(events).forEach(function (key) {
        var parts = key.split(' '), method = this[events[key]];
        this.$el.on(parts.shift(), parts.join(' '), jQuery.proxy(method, this));
      }, this);
    }
  });
});
