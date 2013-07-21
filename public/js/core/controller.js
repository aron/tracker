define(['core/events', 'vendor/soak'], function () {
  var Events = require('core/events'),
      soak = require('vendor/soak');

  return soak.inherit(Events, {
    constructor: function Controller() {
      Events.apply(this, arguments);
    }
  });
});
