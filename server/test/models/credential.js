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
      it('finds and returns a user with an ID known to be in the table', (done) => {
        // Pick a random user from the fixture and try to find that user by ID
        const randomUser = randomItem(fixture.tables.credential);
        credentialModel.findById(randomUser.id, ['id']).then((user) => {
          expect(user.id).to.equal(randomUser.id);

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

  describe('loginWithPhone', () => {
    describe('success', () => {
      it('returns user X\'s ID when the given credentials match those of user X', (done) => {
        // Pick a random user from the fixture and try to log in as that user
        const randomUser = randomItem(fixture.tables.credential);

        // NOTE: Passwords are never stored in the user table, and thus aren't in the table fixtures
        // For convenience in this test, the test users' passwords are just their phone numbers.
        credentialModel.loginWithPhone(randomUser.phone, randomUser.phone).then((user) => {
          expect(user).to.not.be.null;
          expect(user.id).to.equal(randomUser.id);

          done();
        }).catch(done);
      });
    });

    describe('failure', () => {
      it('fails when given a valid phone number but an invalid password', (done) => {
        const randomUser = randomItem(fixture.tables.credential);

        credentialModel.loginWithPhone(randomUser.phone, 'not randomUser\'s password').then(() => {
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
        const newUser = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'p@55w0rd',
        };

        // Register the user, then log in to make sure it shows up in the DB
        credentialModel.signupWithPhone(newUser.phone, newUser.password)
            .then(() => credentialModel.loginWithPhone(newUser.phone, newUser.password))
            .then((user) => credentialModel.findById(user.id, ['phone']))
            .then((user) => {
              expect(user).to.be.not.null;
              expect(user.phone).to.equal(newUser.phone);
              done();
            })
            .catch(done);
      });
    });

    describe('failure', () => {
      it('fails when given an existing phone number and password', (done) => {
        const randomUser = randomItem(fixture.tables.credential);

        credentialModel.signupWithPhone(randomUser.phone, 'password').then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when given an invalid phone number', (done) => {
        const newUser = {
          phone: '123a456b7890',
          password: 'p@55w0rd',
        };

        credentialModel.signupWithPhone(newUser.phone, newUser.password).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when given an invalid password', (done) => {
        const newUser = {
          phone: '123a456b7890',
          password: 'a',
        };

        credentialModel.signupWithPhone(newUser.phone, newUser.password).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when not given a phone number', (done) => {
        const newUser = {
          password: 'p@55w0rd',
        };

        credentialModel.signupWithPhone(newUser.phone, newUser.password).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });

      it('fails when not given a password', (done) => {
        const newUser = {
          phone: '1234567890',
        };

        credentialModel.signupWithPhone(newUser.phone, newUser.password).then(() => {
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
        const randomUser = randomItem(fixture.tables.credential);
        const newPhone = `${randomUser.phone}!!!`;

        // Update the user
        credentialModel.updateById(randomUser.id, {phone: newPhone}).then(() =>
            // Retrieve the updated user from the DB
            credentialModel.findById(randomUser.id, ['phone']).then((user) => {
              // Ensure that the nickname is updated
              expect(user).not.to.be.null;
              expect(user.phone).to.equal(newPhone);
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
        const randomUser = randomItem(fixture.tables.credential);

        credentialModel.updateById(randomUser.id, {asdfghjkl: 3.14159}).then(() => {
          done(new Error('Did not fail when expected to'));
        }).catch(() => {
          done();
        });
      });
    });
  });
});
