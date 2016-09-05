/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const app = require('../../../app');
const db = require('../../../app/database');
const fixture = require('../../fixtures/user');
const randomItem = require('../../utils').randomItem;
const tfa = require('../../../app/services/tfa');
const credentialModel = require('../../../app/models/credential');
const request = require('supertest');
const sinon = require('sinon');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

describe('Signup Routing', () => {
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

  describe('Phone on mobile', () => {
    describe('valid input', () => {
      it('(200) Responds OK when given valid credentials for a new user', (done) => {
        const data = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone/mobile')
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
            .post('/api/signup/phone/mobile')
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
            .post('/api/signup/phone/mobile')
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
            .post('/api/signup/phone/mobile')
            .send(data)
            .expect(400)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });

      it('(400) Responds Bad Request when given the phone number of an existing user', (done) => {
        const randomUser = randomItem(fixture.tables.credential);

        const data = {
          phone: randomUser.phone,
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone/mobile')
            .send(data)
            .expect(400)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });
    });
  });

  describe('Phone on web', () => {
    describe('valid input with various captcha', () => {
      const fixtureCaptcha = 'ABCDEF';
      const fixtureUser = {
        phone: '18610322136', // Known-valid Chinese phone number
        password: 'p@55w0rd',
      };
      let fixtureHash;

      before((done) => {
        bcrypt.hashAsync(fixtureCaptcha, 12).then((hash) => {
          fixtureHash = hash;
          done();
        });
      });

      it('(200) Responds OK when captcha is valid', (done) => {
        const data = Object.assign({}, fixtureUser, {
          captcha: fixtureCaptcha,
          hash: fixtureHash,
        });

        request(app)
            .post('/api/signup/phone/web')
            .send(data)
            .expect(200)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });

      it('(400) Responds Bad Request when captcha is invalid', (done) => {
        const data = Object.assign({}, fixtureUser, {
          captcha: 'FEDCBA',
          hash: fixtureHash,
        });

        request(app)
            .post('/api/signup/phone/web')
            .send(data)
            .expect(400)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });
    });
  });

  describe('post /api/signup/verify', () => {
    // Spy on the update function
    const spy = sinon.spy(credentialModel, 'updateById');

    afterEach(() => {
      spy.reset();
    });

    it('(200) valid non-verified user with valid code', (done) => {
      const testUser = fixture.tables.credential[0];

      const data = {
        uid: testUser.id,
        code: tfa.generateCode(testUser.tfa_secret),
      };

      request(app)
          .post('/api/signup/verify')
          .send(data)
          .expect(200)
          .end((err, _) => {
            sinon.assert.calledWith(spy, testUser.id, {is_verified: true});
            if (err) done(err);
            else done();
          });
    });

    it('(400) valid non-verified user with invalid code', (done) => {
      const testUser = fixture.tables.credential[0];

      const data = {
        uid: testUser.id,
        code: '123456',
      };

      request(app)
          .post('/api/signup/verify')
          .send(data)
          .expect(400)
          .end((err, _) => {
            sinon.assert.notCalled(spy);
            if (err) done(err);
            else done();
          });
    });
  });
});
