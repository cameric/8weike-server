/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const app = require('../../../app');
const db = require('../../../app/database');
const fixture = require('../../fixtures/user');
const randomItem = require('../../utils').randomItem;
const request = require('supertest');

describe('Login Routing', () => {
  beforeEach((done) => {
    // Truncate the user table
    db.truncate(['credential', 'profile'])
        // Import the fixture
        .then(() => db.importTablesFromFixture(fixture, ['profile', 'credential']))
        // Finish
        .then(done.bind(null, null))
        .catch(done);
  });

  after((done) => {
    db.truncate(['credential', 'profile'])
        .then(done.bind(null, null))
        .catch(done);
  });

  describe('POST /api/login/phone', () => {
    describe('valid input', () => {
      it('(200) Login success when given valid credentials', (done) => {
        const randomCredential = randomItem(fixture.tables.credential);

        const data = {
          phone: randomCredential.phone,
          // In the fixture, all users' phone numbers are their passwords
          password: randomCredential.phone,
        };

        request(app)
            .post('/api/login/phone')
            .send(data)
            .expect(200, done);
      });
    });

    describe('invalid input', () => {
      it('(401) responds with Unauthorized when given invalid credentials', (done) => {
        const data = {
          phone: '123a456b7890',
          password: 'password',
        };

        request(app)
            .post('/api/login/phone')
            .send(data)
            .expect(401, done);
      });
    });
  });

  describe('Weixin', () => {
    // TODO
  });

  describe('Weibo', () => {
    // TODO
  });
});
