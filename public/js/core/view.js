define(['core/events', 'jquery'], function () {
  var jQuery = require('jquery'),
      Events = require('core/events');

  return Events.extend({
    constructor: function View(element, options) {
      Events.apply(this, arguments);
      this.el = element || document.createElement('div');
      this.$el = jQuery(element);
      this.options = jQuery.extend({}, this.constructor.options, options);
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
