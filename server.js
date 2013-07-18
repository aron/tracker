var http   = require('http');
var url    = require('url');
var qs     = require('querystring');
var uuid   = require('node-uuid').v4;
var static = require('node-static');
var ENV    = process.env;

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
  var id = uuid();
  var query = {
    client_id: CLIENT_ID,
    scope: "non-expiring",
    response_type: "code",
    redirect_uri: CLIENT_DOMAIN + "/auth/readmill/callback"
  };

  var location = url.format({
    host: AUTH_HOST,
    query: query,
    pathname: "/oauth/authorize"
  });

  res.writeHead(303, {"Location": location});
  res.end();
}

function authCallback(req, res) {
  var parsed     = url.parse(req.url, true);
  var code       = parsed.query.code;
  var error      = parsed.query.error;

  function respond(hash) {
    parts = url.parse('/callback.html', true);
    parts.hash = hash
    res.writeHead(303, {"Location": url.format(parts)});
    res.end();
  }

  if (error) {
    return respond(qs.stringify({error: error}));
  }

  var query = qs.stringify({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: CLIENT_DOMAIN + "/auth/readmill/callback",
    code: code
  });

  var options = {
    host: AUTH_HOST,
    path: "/oauth/token",
    method: "POST",
    headers: {
      "Content-Length": query.length,
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
    respond(qs.stringify({error: "client-error"}));
  });

  clientRequest.end(query);
}

var fileServer = new static.Server('./public');
var httpServer = http.createServer(function (req, res) {
  req.on('end', function () {
    var parsed = url.parse(req.url);

    if (req.method.toLowerCase() === "options") {
      res.setHeader("Content-Length", 0);
      res.end();
    } else if (parsed.pathname.indexOf("/auth/readmill/callback") === 0) {
      authCallback(req, res);
    } else if (parsed.pathname.indexOf("/auth/readmill") === 0) {
      authorize(req, res);
    } else {
      fileServer.serve(req, res);
    }
  });
});

var PORT = ENV["PORT"] || 8000;
httpServer.listen(PORT);
process.stdout.write("Server started at http://localhost:" + PORT + "\n");
