window.requirejs.config({
  baseUrl: '/js',
  paths: {
    jquery: 'vendor/jquery'
  }
});

require(['controllers/application', 'core/auth', 'core/settings'], function () {
  var ApplicationController = require('controllers/application'),
      settings = require('core/settings').extract(document.head),
      auth = require('core/auth');

  document.getElementById('login').addEventListener('click', function (event) {
    event.preventDefault();
    auth.authorize(window);
  }, false);

  window.app = new ApplicationController(settings);
});
