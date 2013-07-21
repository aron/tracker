define(['core/events'], function () {
  var Events = require('core/events');

  return Events.extend({
    constructor: function Controller() {
      Events.apply(this, arguments);
    }
  });
});
