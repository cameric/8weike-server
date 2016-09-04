/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const app = require('../../../app');
const db = require('../../../app/database');
const fixture = require('../../fixtures/user');
const randomItem = require('../../utils').randomItem;
const expect = require('chai').expect;
const Promise = require('bluebird');
const sinon = require('sinon');
const request = require('supertest');

const sms = require('../../../app/services/sms');
const tfa = require('../../../app/controllers/auth/tfa');
const credentialModel = require('../../../app/models/credential');

describe('TFA Routing', () => {
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

  describe('POST /api/tfa/send', () => {
    // Mock out send sms so that it actually won't be called
    let stub = sinon.stub(sms, 'send');
    stub.returns(Promise.resolve());

    afterEach(() => {
      stub.reset();
    });

    after(() => {
      sms.send.restore();
    });

    it('(200) Return success: true when user exists', (done) => {
      const randomUser = randomItem(fixture.tables.credential);

      const data = {
        uid: randomUser.id,
      };

      request(app)
        .post('/api/tfa/send')
        .send(data)
        .expect(200)
        .end((err, res) => {
          if (err) done(err);
          sinon.assert.calledWith(stub, randomUser.phone);
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('(400) responds with Bad Request when user does not exist', (done) => {
      const data = {
        uid: 104324,
      };

      request(app)
        .post('/api/tfa/send')
        .send(data)
        .expect(400)
        .end((err, _) => {
          sinon.assert.notCalled(stub);
          if (err) done(err);
          else done();
        });
    });
  });

  describe('POST /api/tfa/verify', () => {
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
        .post('/api/tfa/verify')
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
        .post('/api/tfa/verify')
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
