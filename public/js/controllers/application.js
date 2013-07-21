define([
  'core/controller',
  'core/client',
  'core/events'
], function () {
  var Controller = require('core/controller'),
      Events = require('core/events'),
      Client = require('core/client');

  return Controller.extend({
    constructor: function (settings) {
      Controller.call(this);

      this.client = new Client({
        clientId: settings['readmill:client-id'],
        accessToken: localStorage['readmill-token']
      });

      this.hub = new Events();
    }
  });
});
