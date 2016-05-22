'use strict';

var SwaggerExpress = require('swagger-express-mw');
var jwt = require('express-jwt');
var app = require('express')();

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

// Read JWT secret from environment
var secret = process.env.JWT_SECRET || "d3vel0p";

// Everything protected by JWT unless /swagger.
app.use(
  jwt({ secret: secret }).unless({
    path: ["/swagger"]
  })
);

// Handle the authentication failure
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'invalid token...' });
  }
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});