
/*!
 * Ext JS Connect
 * Copyright(c) 2010 Sencha Inc.
 * MIT Licensed
 */

module.exports = function basicAuth(callback, realm) {
  realm = realm || 'Authorization Required';

  function unauthorized(res) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="' + realm + '"' });
    res.end();
  }

  function badRequest(res) {
    res.writeHead(400);
    res.end('Bad Request');
  }

  function success(req, res, auth, next) {
      req.remoteUser = auth[0];
      req.remotePass = auth[1];
      next();
  }

  return function(req, res, next) {
    var authorization = req.headers.authorization;

    if (!authorization) return unauthorized(res);

    var parts = authorization.split(' ')
      , scheme = parts[0]
      , credentials = new Buffer(parts[1], 'base64').toString().split(':');

    if ('Basic' != scheme) return badRequest(res);

    callback(credentials[0], credentials[1],
      function(){success(req, res, credentials, next);},
      function(){unauthorized(res)}
    );
  }
};

