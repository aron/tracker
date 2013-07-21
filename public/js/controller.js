define(['events', 'vendor/soak'], function () {
  var Events = require('events'),
      soak = require('vendor/soak');

  return soak.inherits(Events, {
    constructor: function Controller() {
      Events.apply(this, arguments);
    }
  });
});
