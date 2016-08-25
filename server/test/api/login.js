/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const app = require('../../app');
const db = require('../../app/database');
const expect = require('chai').expect;
const fixture = require('../fixtures/user');
const request = require('supertest');

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

describe('Login Routing', () => {
  beforeEach((done) => {
    // Truncate the user table
    db.truncate(['user'])
    // Import the fixture
        .then(() => db.importFixture(fixture))
        // Finish
        .then(done.bind(null, null))
        .catch(done);
  });

  after((done) => {
    db.truncate(['user'])
        .then(done.bind(null, null))
        .catch(done);
  });

  describe('POST /api/login/phone', () => {
    describe('valid input', () => {
      const randomUser = randomItem(fixture.tables.user);

      it('redirects to /api/user/* when given valid credentials', (done) => {
        const data = {
          phone: randomUser.phone,
          password: randomUser.password,
        };

        request(app)
            .post('/api/login/phone')
            .send(data)
            .expect(302)
            .end((err, res) => {
              if (err) done(err);

              expect(res.header.location).to.include('/api/user/');
              done();
            });
      });
    });

    describe('invalid input', () => {
      it('redirects to /api/login when given invalid credentials', (done) => {
        const data = {
          phone: '123a456b7890',
          password: 'password',
        };

        request(app)
            .post('/api/login/phone')
            .send(data)
            .expect(302)
            .end((err, res) => {
              if (err) done(err);

              expect(res.header.location).to.include('/api/login/phone');
              done();
            });
      });
    });
  });

  describe('Weixin', () => {
    it('should be tested later...', (done) => {
      done();
    });
  });

  describe('Weibo', () => {
    it('should be tested later...', (done) => {
      done();
    });
  });
});
