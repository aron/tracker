requirejs.config({
  baseUrl: '/js',
  paths: {
    jquery: 'vendor/jquery'
  }
});

require(['auth'], function () {
  var auth = require('auth');

  document.getElementById('login').addEventListener('click', function (event) {
    event.preventDefault();
    auth.authorize(window);
  }, false);
});
