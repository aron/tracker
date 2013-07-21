define(function () {
  return {
    parseQueryString: function (string) {
      var obj = {};
      var decode = window.decodeURIComponent;

      string.split('&').forEach(function (param) {
        var parts = param.split('=');
        obj[decode(parts[0])] = decode(parts[1]);
      });

      return obj;
    }
  };
});
