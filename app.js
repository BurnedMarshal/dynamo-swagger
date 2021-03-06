'use strict';

var SwaggerExpress = require('swagger-express-mw');
var jwt = require('express-jwt');
var app = require('express')();

//Setting environment variable
var NODE_ENV = process.env.NODE_ENV || "development";

//Setting connection to dynamodb and load specific configuration
var vogels = require('vogels');
var dynamoDbConf = require('./dynamodb.json');
vogels.AWS.config.update(dynamoDbConf[NODE_ENV]);
//Load Models
var User = require('./api/models/user');

vogels.createTables({
  'User': {readCapacity: 20, writeCapacity: 4}
}, function(err) {
  if (err) {
    console.error('Error creating tables: ', err);
  } else {
    console.log('Tables has been created');
  }
});

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

});
