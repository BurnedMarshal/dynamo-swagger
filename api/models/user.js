'use strict'

var vogels = require('vogels');
var Joi = require('joi');
vogels.AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
  accessKeyId: "abcd1",
  secretAccessKey: 'SECRET'
});

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
