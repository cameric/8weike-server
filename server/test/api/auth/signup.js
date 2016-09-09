/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const Promise = require('bluebird');

const app = require('../../../app');
const credentialModel = require('../../../app/models/credential');
const db = require('../../../app/database');
const fixture = require('../../fixtures/user');
const tfa = require('../../../app/services/tfa');
const utils = require('../../utils');

const bcrypt = Promise.promisifyAll(require('bcrypt'));
const request = require('supertest');
const sinon = require('sinon');

describe('Signup Routing', () => {
  before(() => {
    // Stub out sms service so that it won't send code
    let stub = sinon.stub(tfa, 'sendCode');
    stub.returns(Promise.resolve());
  });

  beforeEach((done) => {
    // Truncate the credential table
    db.truncate(['credential', 'profile'])
    // Import the fixture
        .then(() => db.importTablesFromFixture(fixture, ['profile', 'credential']))
        // Finish
        .then(done.bind(null, null))
        .catch(done);
  });

  after((done) => {
    tfa.sendCode.restore();

    db.truncate(['credential', 'profile'])
        .then(done.bind(null, null))
        .catch(done);
  });

  describe('Phone on mobile', () => {
    describe('valid input', () => {
      it('(200) Responds OK when given valid credentials for a new credential', (done) => {
        const data = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone/mobile')
            .send(data)
            .expect(200, done)
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
            .expect(400, done);
      });

      it('(400) Responds Bad Request when not given a password', (done) => {
        const data = {
          phone: '18610322136',
        };

        request(app)
            .post('/api/signup/phone/mobile')
            .send(data)
            .expect(400, done);
      });

      it('(400) Responds Bad Request when given a malformed phone number', (done) => {
        const data = {
          phone: '123a456b7890',
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone/mobile')
            .send(data)
            .expect(400, done);
      });

      it('(400) Responds Bad Request when signing up with an existing phone number', (done) => {
        const randomUser = utils.randomItem(fixture.tables.credential);

        const data = {
          phone: randomUser.phone,
          password: 'p@55w0rd',
        };

        request(app)
            .post('/api/signup/phone/mobile')
            .send(data)
            .expect(400, done);
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
            .expect(200, done);
      });

      it('(400) Responds Bad Request when captcha is invalid', (done) => {
        const data = Object.assign({}, fixtureUser, {
          captcha: 'FEDCBA',
          hash: fixtureHash,
        });

        request(app)
            .post('/api/signup/phone/web')
            .send(data)
            .expect(400, done);
      });
    });
  });

  describe('POST /api/signup/verify', () => {
    // Spy on the update function
    const spy = sinon.spy(credentialModel, 'save');

    afterEach(() => {
      spy.reset();
    });

    const signupInfo = {
      phone: '18610322136', // Known-valid Chinese phone number
      password: 'p@55w0rd',
    };

    describe('Valid input', () => {
      it('(200) valid non-verified credential with valid code', (done) => {
        const agent = request.agent(app);
        utils.signupWithAgent(agent, signupInfo.phone, signupInfo.password).then(() => {
          const data = {
            code: '123456',
          };

          agent
              .post('/api/signup/verify')
              .send(data)
              .expect(200)
              .end((err, _) => {
                // TODO(spencer): save is called internally with an object including random data
                // There is not good way to do the following test, as far as I know
                // sinon.assert.calledWith(spy, testCredential.id, {});
                if (err) done(err);
                else done();
              });
        }).catch(done);
      });
    });

    describe('Invalid input', () => {
      it('(400) valid non-verified credential with invalid code', (done) => {
        const agent = request.agent(app);
        utils.signupWithAgent(agent, signupInfo.phone, signupInfo.password).then(() => {
          const data = {
            code: '123456',
          };

          agent
              .post('/api/signup/verify')
              .send(data)
              .expect(400)
              .end((err, _) => {
                sinon.assert.notCalled(spy);
                if (err) done(err);
                else done();
              });
        }).catch(done);
      });
    });
  });
});
