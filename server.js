var http = require('http');
var url  = require('url');
var qs   = require('querystring');
var ENV  = process.env;

var AUTH_HOST       = "readmill.com";
var CLIENT_DOMAIN   = ENV["READMILL_CLIENT_DOMAIN"];
var CLIENT_ID       = ENV["READMILL_CLIENT_ID"];
var CLIENT_SECRET   = ENV["READMILL_CLIENT_SECRET"];
var CLIENT_CALLBACK = ENV["READMILL_CLIENT_CALLBACK"];

if (!CLIENT_DOMAIN)   { throw "Requires READMILL_CLIENT_DOMAIN environment variable"; }
if (!CLIENT_ID)       { throw "Requires READMILL_CLIENT_ID environment variable"; }
if (!CLIENT_SECRET)   { throw "Requires READMILL_CLIENT_SECRET environment variable"; }
if (!CLIENT_CALLBACK) { throw "Requires READMILL_CLIENT_CALLBACK environment variable"; }

function authorize(req, res) {
  var parsed   = url.parse(req.url, true);
  var query    = parsed.query;
  var pathname = parsed.pathname;

  // Fail early if callback uri is invalid.
  if (CLIENT_CALLBACK.split("?")[0] === query["redirect_uri"].split("?")[0]) {
    res.writeHead(400);
    res.end();
    return;
  }

  query.redirect_uri = CLIENT_DOMAIN + "/auth/readmill/callback";
  query.scope = "non-expiring";

  var location = url.format({
    host: AUTH_HOST,
    query: query,
    pathname: pathname
  });

  res.writeHead(303, {"Location": location});
  res.end();
}

function authCallback(req, res) {
  var parsed = url.parse(req.url, true);
  var code   = parsed.query.code;
  var error  = parsed.query.error;

  function respond(hash) {
    parts = url.parse(redirect, true);
    res.writeHead(303, {"Location": url.format(parts)});
    res.end();
  }

  if (error) {
    return respond(qs.stringify({error: error}));
  }

  var query = {
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: CLIENT_DOMAIN + "/callback",
    code: code
  };

  var queryString = qs.stringify(query);
  var options = {
    host: AUTH_HOST,
    path: "/oauth/token",
    method: "POST",
    headers: {
      "Content-Length": queryString.length,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  var clientRequest = http.request(options, function (response) {
    var body = "";

    response.on("data", function (data) {
      body += data;
    });

    response.on("end", function () {
      var json = JSON.parse(body);
      respond(qs.stringify(json));
    });
  });

  clientRequest.on("error", function (err) {
    respond(qs.stringify({error: "proxy-error"}));
  });

  clientRequest.end(queryString);
}

var server = http.createServer(function (req, res) {
  var parsed = url.parse(req.url);

  if (req.method.toLowerCase() == "options") {
    res.setHeader("Content-Length", 0);
    res.end();
  } else if (parsed.pathname.indexOf("/auth/readmill") === 0) {
    authorize(req, res);
  } else if (parsed.pathname.indexOf("/auth/readmill/callback") === 0) {
    authCallback(req, res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

var PORT = ENV["PORT"] || 8000;
server.listen(PORT);
process.stdout.write("Server started at http://localhost:" + PORT + "\n");
