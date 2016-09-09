/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const db = require('../../app/database');
const expect = require('chai').expect;
const fixture = require('../fixtures/user');
const randomItem = require('../utils').randomItem;
const profileModel = require('../../app/models/profile');

describe('Profile Model', () => {
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

  describe('findByCredential', () => {
    describe('success', () => {
      it('finds and returns a profile with a user that exists', (done) => {
        // This is a verified user that has an associated profile
        const testCredential = fixture.tables.credential[2];
        const testProfile = fixture.tables.profile[0];

        profileModel.findByCredential(testCredential.id, ['nickname']).then((profile) => {
          expect(profile.nickname).to.equal(testProfile.nickname);
          done();
        }).catch(done);
      });
    });

    describe('failure', () => {
      it('fails when the user does not exist', (done) => {
        profileModel.findByCredential(99999999999, ['nickname']).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when the user has not set up a profile', (done) => {
        // This is a verified user that does not have an associated profile
        const testUser = fixture.tables.credential[1];

        profileModel.findByCredential(testUser.id, ['nickname']).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });

  describe('createProfileForCredential', () => {
    const fixtureNickname = 'Harry Potter';

    describe('success', () => {
      it('create a new profile with nickname', (done) => {
        // This is a verified user that does not have an associated profile
        const testCredential = fixture.tables.credential[1];

        profileModel.createProfileForCredential(testCredential.id, {
          nickname: fixtureNickname,
        }).then((profile) => {
          expect(profile.affectedRows).to.equal(1);
          done();
        }).catch(done);
      });
    });

    describe('failure', () => {
      it('fails when the user does not exist', (done) => {
        profileModel.createProfileForCredential(99999999999, {
          nickname: fixtureNickname,
        }).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when the user already has a profile', (done) => {
        // This is a verified user that already has an associated profile
        const testCredential = fixture.tables.credential[2];

        profileModel.createProfileForCredential(testCredential.id, {
          nickname: fixtureNickname,
        }).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });

  describe('updateByCredential', () => {
    const newNickname = 'Steve Jobs';

    describe('success', () => {
      it('update a profile with a user that exists', (done) => {
        // This is a verified user that has an associated profile
        const testCredential = fixture.tables.credential[2];

        profileModel.updateByCredential(testCredential.id, { nickname: newNickname }).then(() => {
          return profileModel.findByCredential(testCredential.id, ['nickname']);
        }).then((profile) => {
          expect(profile.nickname).to.equal(newNickname);
          done();
        }).catch(done);
      });
    });

    describe('failure', () => {
      it('fails when the user does not exist', (done) => {
        profileModel.updateByCredential(99999999999, { nickname: newNickname }).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when the user has not set up a profile', (done) => {
        // This is a verified user that does not have an associated profile
        const testUser = fixture.tables.credential[1];

        profileModel.updateByCredential(testUser.id, { nickname: newNickname }).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });
});
