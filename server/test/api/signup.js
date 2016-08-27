/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const app = require('../../app');
const db = require('../../app/database');
const fixture = require('../fixtures/user');
const randomItem = require('../utils').randomItem;
const request = require('supertest');

describe('Signup Routing', () => {
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

  describe('Phone', () => {
    describe('valid input', () => {
      it('(200) Responds OK when given valid credentials for a new user', (done) => {
        const data = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone')
            .send(data)
            .expect(200)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });
    });

    describe('invalid input', () => {
      it('(400) Responds Bad Request when not given a phone number', (done) => {
        const data = {
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone')
            .send(data)
            .expect(400)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });

      it('(400) Responds Bad Request when not given a password', (done) => {
        const data = {
          phone: '18610322136',
        };

        request(app)
            .post('/api/signup/phone')
            .send(data)
            .expect(400)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });

      it('(400) Responds Bad Request when given a malformed phone number', (done) => {
        const data = {
          phone: '123a456b7890',
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone')
            .send(data)
            .expect(400)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });

      it('(400) Responds Bad Request when given the phone number of an existing user', (done) => {
        const randomUser = randomItem(fixture.tables.user);

        const data = {
          phone: randomUser.phone,
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone')
            .send(data)
            .expect(400)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });
    });
  });
});
