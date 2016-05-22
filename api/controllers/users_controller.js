'user strict'

var util = require('util');
var async = require('async');
var crypto = require('crypto');
var _ = require('underscore');
var User = require('../models/user');

module.exports = {
    newUser: createUser
};

function createUser(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var user = req.body;


    var shasum = crypto.createHash('sha256');
    shasum.update(user.password);
    user.password = shasum.digest('hex');

    User.create(user, function(){
      User.scan().where('email').equals(user.email).exec(function(err, dynamoRes){
        if(err){
          res.status(500).json(err);
        }else {
            res.status(201).json(dynamoRes.Items[0]);
        }
      });
    })
}
