requirejs.config({
  baseUrl: '/js',
  paths: {
    jquery: 'vendor/jquery'
  }
});

require(['core/auth', 'core/client', 'core/settings'], function () {
  var auth = require('core/auth'),
      Client = require('core/client'),
      settings = require('core/settings').extract(document.head);

  document.getElementById('login').addEventListener('click', function (event) {
    event.preventDefault();
    auth.authorize(window);
  }, false);

  window.client = new Client({
    clientId: settings['readmill:client-id'],
    accessToken: localStorage['readmill-token']
  });
});
