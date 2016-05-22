var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var crypto = require('crypto');
var jsonwebtoken = require('jsonwebtoken');

var email = 'jsmith@example.org';
var secret = process.env.JWT_SECRET || "d3vel0p";
var token = jsonwebtoken.sign({
    email: email
}, secret);

var userId = null;

describe('controllers', function() {

    describe('users_controller', function() {

        describe('POST /users', function() {

            it('should return the new user object', function(done) {

                request(server)
                    .post('/users')
                    .send({
                        'email': email,
                        'name': 'Scott',
                        'password': 'secrete'
                    })
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .end(function(err, res) {
                        should.not.exist(err);

                        res.body.should.have.property('name', 'Scott');
                        res.body.should.have.property('email', email);

                        var shasum = crypto.createHash('sha256');
                        shasum.update('secrete');
                        var password = shasum.digest('hex');

                        res.body.should.have.property('password', password);

                        res.body.should.have.property('userId').with.lengthOf(36);
                        userId = res.body.userId;



                        describe(`GET /users/${userId}`, function() {

                            it('should return an user object', function(done) {

                                request(server)
                                    .get(`/users/${userId}`)
                                    .set('Accept', 'application/json')
                                    .set('Authorization', `Bearer ${token}`)
                                    .expect('Content-Type', /json/)
                                    .expect(200)
                                    .end(function(err, res) {
                                        should.not.exist(err);

                                        res.body.should.have.property('name', 'Scott');
                                        res.body.should.have.property('email', email);

                                        var shasum = crypto.createHash('sha256');
                                        shasum.update('secrete');
                                        var password = shasum.digest('hex');

                                        res.body.should.have.property('password', password);
                                        res.body.should.have.property('userId', userId);

                                        done();
                                    });

                            });

                        });


                        describe(`GET /users`, function() {

                            it('should return all users object', function(done) {

                                request(server)
                                    .get(`/users`)
                                    .set('Accept', 'application/json')
                                    .set('Authorization', `Bearer ${token}`)
                                    .expect('Content-Type', /json/)
                                    .expect(200)
                                    .end(function(err, res) {
                                        should.not.exist(err);
                                        res.body.should.be.a.Array();

                                        done();
                                    });

                            });

                        });


                        done();
                    });

            });
        });


    });

});
