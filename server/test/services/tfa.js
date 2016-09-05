/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const app = require('../../app');
const db = require('../../app/database');
const fixture = require('../fixtures/user');
const randomItem = require('../utils').randomItem;
const Promise = require('bluebird');
const sinon = require('sinon');

const sms = require('../../app/services/sms');
const tfa = require('../../app/services/tfa');

describe('TFA Services', () => {
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

  describe('Send TFA code', () => {
    // Mock out send sms so that it actually won't be called
    let stub = sinon.stub(sms, 'send');
    stub.returns(Promise.resolve());

    afterEach(() => {
      stub.reset();
    });

    after(() => {
      sms.send.restore();
    });

    it('Success when credential exists', (done) => {
      const randomUser = randomItem(fixture.tables.credential);

      tfa.sendCode(randomUser.id).then(() => {
        sinon.assert.calledWith(stub, randomUser.phone);
        done();
      }).catch(done);
    });

    it('Error when credential does not exist', (done) => {
      const randomId = 104324;

      tfa.sendCode(randomId).then(() => {
        done(new Error('Did not fail when expected to'));
      }).catch(() => {
        sinon.assert.notCalled(stub);
        done();
      });
    });
  });

  describe('Verify TFA code', () => {
    it('Success when valid non-verified credential with valid code', (done) => {
      const testUser = fixture.tables.credential[0];

      tfa.verifyCode(testUser.id, tfa.generateCode(testUser.tfa_secret)).then(() => {
        done();
      }).catch(done);
    });

    it('Error when non-verified credential with invalid code', (done) => {
      const testUser = fixture.tables.credential[0];

      tfa.verifyCode(testUser.id, '123456').then(() => {
        done(new Error('Did not fail when expected to'));
      }).catch(() => {
        done();
      });
    });
  });
});
