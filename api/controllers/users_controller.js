'user strict'

var util = require('util');
var crypto = require('crypto');
var _ = require('underscore');
var User = require('../models/user');

module.exports = {
    newUser: createUser,
    users: listUsers,
    user: showUser,
    updateUser: updateUser,
    deleteUser: deleteUser
};

function createUser(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var user = req.body;


    var shasum = crypto.createHash('sha256');
    shasum.update(user.password);
    user.password = shasum.digest('hex');

    User.create(user, function() {
        User.scan().where('email').equals(user.email).exec(function(err, dynamoRes) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(201).json(dynamoRes.Items[0]);
            }
        });
    })
}

function showUser(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var userId = req.swagger.params.userId.value;
    User.scan().where('userId').equals(userId).exec(function(err, dynamoRes) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(dynamoRes.Items[0]);
        }
    });
}

function listUsers(req, res) {
    User.scan().limit(10).exec(function(err, dynamoRes) {
        if (err) {
            res.status(500).json(err);
        } else {
            var data = _.pluck(dynamoRes.Items, 'attrs');
            res.status(200).json(data);
        }
    });
}

//TODO: Fix update function, don't working ...
function updateUser(req, res) {
    var user = req.body;
    user.userId = req.swagger.params.userId.value;
    if (!user.email) {
        User.scan().where('userId').equals(user.userId).exec(function(err, dynamoRes) {
            if (err) {
                res.status(500).json(err);
            } else {
                user.email = dynamoRes.Items[0].attrs.email;
                User.update(user, function(err, updatedUser) {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).json(updatedUser);
                    }
                });
            }
        });
    } else {
        User.update(user, function(err, updatedUser) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(updatedUser);
            }
        });
    }

}

function deleteUser(req, res) {
    var userId = req.swagger.params.userId.value;

    User.scan().where('userId').equals(userId).exec(function(err, dynamoRes) {
            if (err) {
                res.status(404).json(err);
            } else {
                var email = dynamoRes.Items[0].attrs.email;
                User.destroy({email:email},
                  function(err) {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).json({message: "Resource deleted"});
                    }
                });
            }
        });
    }
