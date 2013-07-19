define(['jquery', 'vendor/soak'], function () {
  var jQuery = require('jquery');
  var soak = require('vendor/soak');

  return soak.inherit(Object, {
    constructor: function ReadmillClient(options) {
      options = options || {};

      this.clientId = options.clientId;
      this.accessToken = options.accessToken;
      this.apiEndpoint = options.apiEndpoint || 'https://api.readmill.com/v2';

      if (!this.clientId) { throw Error('ReadmillClient requires a clientId'); }
      if (!this.accessToken) { throw Error('ReadmillClient requires a accessToken'); }
    },
    request: function (options) {
      options = jQuery.extend({
        url: this.apiEndpoint + options.path,
        method: options.method || 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'OAuth ' + this.accessToken
        }
      }, options);

      return jQuery.ajax(options);
    }
  });
});
