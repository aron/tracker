define(['core/utils'], function () {
  var utils = require('core/utils');

  return {
    authorize: function (window) {
      var left  = window.screenX + (window.outerWidth  - 725)  / 2;
      var top   = window.screenY + (window.outerHeight - 575) / 2;
      var popup = window.open('/auth/readmill', 'readmill-login', 'location=1,toolbars=no,scrollbars=yes,left=' + left + 'top=' + top);

      window.authCallback = function () {
        var hash = popup.location.hash.slice(1);
        var params = utils.parseQueryString(hash);

        if (params.access_token) {
          window.localStorage['readmill-token'] = params.access_token;
        }

        popup.close();
      };
    }
  };
});
