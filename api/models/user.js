'use strict'

//Setting environment variable
var NODE_ENV = process.env.NODE_ENV || "development";

//Setting connection to dynamodb and load specific configuration
var vogels = require('vogels');
var Joi = require('joi');
var dynamoDbConf = require('./../../dynamodb.json');
vogels.AWS.config.update(dynamoDbConf[NODE_ENV]);

var User = vogels.define('User', {
  hashKey : 'userId',
  rangeKey : 'email',

  // add the timestamp attributes (updatedAt, createdAt)
  timestamps : true,

  schema : {
    userId  : vogels.types.uuid(),
    email   : Joi.string().email(),
    password: Joi.string(),
    name    : Joi.string(),
    age     : Joi.number(),
    roles   : vogels.types.stringSet(),
    settings : {
      nickname      : Joi.string(),
      acceptedTerms : Joi.boolean().default(false)
    }
  }
});

module.exports = User;
