/* eslint-env node, mocha */
const expect = require('chai').expect;
const authyModel = require('../../app/models/authy');

describe('Authy service utilities', () => {
  describe('registerInAuthy', () => {
    it('returns a success code with valid phone', (done) => {
      authyModel.registerInAuthy('9094501241')
        .then((authyId) => {
          expect(authyId).to.not.be.null;
          done();
        })
        .catch(done);
    });

    it('returns a failure code with invalid phone', (done) => {
      authyModel.registerInAuthy('909450121')
        .then(() => {
          done(new Error('Did not fail when expected to'));
        })
        .catch(() => {
          done();
        });
    });
  });

  describe('verifyWithAuthy', () => {
    it('return a failure code due to non-existent user', (done) => {
      // Use a fake authyId with a fake TFA code
      authyModel.verifyWithAuthy('12345', '657386')
        .then(() => {
          done(new Error('Did not fail when expected to'));
        })
        .catch(() => {
          done();
        });
    })
  });
});