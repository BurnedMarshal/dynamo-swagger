var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var jsonwebtoken = require('jsonwebtoken');

var email = 'jsmith@example.org';
var secret = process.env.JWT_SECRET || "d3vel0p";
var token = jsonwebtoken.sign({ email: email }, secret);

describe('controllers', function() {

  describe('hello_world', function() {

    describe('GET /hello', function() {

      it('should return an authentication error', function(done) {

        request(server)
          .get('/hello')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.error.should.eql('invalid token...');

            done();
          });
      });

      it('should return a default string', function(done) {

        request(server)
          .get('/hello')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.eql('Hello, stranger!');

            done();
          });
      });

      it('should accept a name parameter', function(done) {

        request(server)
          .get('/hello')
          .query({ name: 'Scott'})
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.eql('Hello, Scott!');

            done();
          });
      });

    });

  });

});
