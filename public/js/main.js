requirejs.config({
  baseUrl: '/js',
  paths: {
    jquery: 'vendor/jquery'
  }
});

require(['auth', 'client', 'settings'], function () {
  var auth = require('auth');
  var Client = require('client');
  var settings = require('settings').extract(document.head);

  document.getElementById('login').addEventListener('click', function (event) {
    event.preventDefault();
    auth.authorize(window);
  }, false);

  window.client = new Client({
    clientId: settings['readmill:client-id'],
    accessToken: localStorage['readmill-token']
  });
});
