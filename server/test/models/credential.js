/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const db = require('../../app/database');
const expect = require('chai').expect;
const fixture = require('../fixtures/user');
const randomItem = require('../utils').randomItem;
const credentialModel = require('../../app/models/credential');

describe('Credential Model', () => {
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

  describe('findById', () => {
    describe('success', () => {
      it('finds and returns a credential with an ID known to be in the table', (done) => {
        // Pick a random user from the fixture and try to find that user by ID
        const randomCredential = randomItem(fixture.tables.credential);
        credentialModel.findById(randomCredential.id, ['id']).then((user) => {
          expect(user.id).to.equal(randomCredential.id);

          done();
        }).catch(done);
      });
    });

    describe('failure', () => {
      it('fails when given an ID known not to be in the table', (done) => {
        // Pick an ID known not to be in the table
        // TODO: there's not a better (constant-time) way to guarantee this, is there?
        credentialModel.findById(99999999999, ['id']).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });

  describe('getProfileForId', () => {
    describe('success', () => {
      it('finds and returns a profile id with an existent credential ID', (done) => {
        // This is a verified user that has an associated profile
        const testCredential = fixture.tables.credential[2];
        credentialModel.getProfileForId(testCredential.id).then((profileId) => {
          expect(profileId).to.equal(testCredential.profile_id);

          done();
        }).catch(done);
      });
    });

    describe('failure', () => {
      it('fails when given an ID known not to be in the table', (done) => {
        // Pick an ID known not to be in the table
        // TODO: there's not a better (constant-time) way to guarantee this, is there?
        credentialModel.getProfileForId(99999999999).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });

  describe('loginWithPhone', () => {
    describe('success', () => {
      it('returns user X\'s ID when the given credentials match those of user X', (done) => {
        // Pick a random user from the fixture and try to log in as that user
        const randomCredential = randomItem(fixture.tables.credential);

        // NOTE: Passwords are never stored in the user table, and thus aren't in the table fixtures
        // For convenience in this test, the test users' passwords are just their phone numbers.
        credentialModel.loginWithPhone(randomCredential.phone, randomCredential.phone)
          .then((credential) => {
            expect(credential).to.not.be.null;
            expect(credential.id).to.equal(randomCredential.id);

            done();
          }).catch(done);
      });
    });

    describe('failure', () => {
      it('fails when given a valid phone number but an invalid password', (done) => {
        const randomCredential = randomItem(fixture.tables.credential);

        credentialModel.loginWithPhone(randomCredential.phone, 'not randomUser\'s password').then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when given an invalid phone number', (done) => {
        credentialModel.loginWithPhone('this is definitely not a phone number', 'password').then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });

  describe('loginWithWeixin', () => {
    // TODO
  });

  describe('loginWithWeibo', () => {
    // TODO
  });

  describe('signupWithPhone', () => {
    describe('success', () => {
      it('adds a new user when given a valid phone number and password', (done) => {
        const newCredential = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'p@55w0rd',
        };

        // Register the user, then log in to make sure it shows up in the DB
        credentialModel.signupWithPhone(newCredential.phone, newCredential.password)
            .then(() => credentialModel.loginWithPhone(newCredential.phone, newCredential.password))
            .then((user) => credentialModel.findById(user.id, ['phone']))
            .then((user) => {
              expect(user).to.be.not.null;
              expect(user.phone).to.equal(newCredential.phone);
              done();
            })
            .catch(done);
      });
    });

    describe('failure', () => {
      it('fails when given an existing phone number and password', (done) => {
        const randomCredential = randomItem(fixture.tables.credential);

        credentialModel.signupWithPhone(randomCredential.phone, 'password').then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when given an invalid phone number', (done) => {
        const newCredential = {
          phone: '123a456b7890',
          password: 'p@55w0rd',
        };

        credentialModel.signupWithPhone(newCredential.phone, newCredential.password).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when given an invalid password', (done) => {
        const newCredential = {
          phone: '123a456b7890',
          password: 'a',
        };

        credentialModel.signupWithPhone(newCredential.phone, newCredential.password).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when not given a phone number', (done) => {
        const newCredential = {
          password: 'p@55w0rd',
        };

        credentialModel.signupWithPhone(newCredential.phone, newCredential.password).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when not given a password', (done) => {
        const newCredential = {
          phone: '1234567890',
        };

        credentialModel.signupWithPhone(newCredential.phone, newCredential.password).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });

  describe('updateById', () => {
    describe('success', () => {
      it('updates the phone number of an existing user', (done) => {
        // Pick a random user from the fixture and try to update their phone number, adding a '!!!'
        const randomCredential = randomItem(fixture.tables.credential);
        const newPhone = `${randomCredential.phone}!!!`;

        // Update the user
        credentialModel.updateById(randomCredential.id, {phone: newPhone}).then(() =>
            // Retrieve the updated user from the DB
            credentialModel.findById(randomCredential.id, ['phone']).then((credential) => {
              // Ensure that the nickname is updated
              expect(credential).not.to.be.null;
              expect(credential.phone).to.equal(newPhone);
              done();
            })
        ).catch(done);
      });
    });

    describe('failure', () => {
      it('fails to update a nonexistent user', (done) => {
        credentialModel.updateById(9999999, {phone: '1234567890'}).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails to update a nonexistent column of an existing user', (done) => {
        const randomCredential = randomItem(fixture.tables.credential);

        credentialModel.updateById(randomCredential.id, {asdfghjkl: 3.14159}).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });
});
