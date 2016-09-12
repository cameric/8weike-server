/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const db = require('../../app/database');
const expect = require('chai').expect;
const fixture = require('../fixtures/user');
const randomItem = require('../utils').randomItem;
const credentialModel = require('../../app/models/credential');

describe('Credential Model', () => {
  beforeEach((done) => {
    db.truncate(['credential', 'profile'])
        .then(() => db.importTablesFromFixture(fixture, ['profile', 'credential']))
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
        // Pick a random credential from the fixture and try to find it by ID
        const randomCredential = randomItem(fixture.tables.credential);
        credentialModel.findById(randomCredential.id, ['id']).then((credential) => {
          expect(credential.id).to.equal(randomCredential.id);

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
        // This is a verified credential that has an associated profile
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
      it('returns credential X\'s ID when the given login info matches those of X', (done) => {
        // Pick a random credential from the fixture and try to log in as that credential
        const randomCredential = randomItem(fixture.tables.credential);

        // NOTE: Passwords are never stored in the credential table, and thus aren't in the table
        // fixtures. For convenience in this test, the test credentials' passwords are just their
        // phone numbers.
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

        credentialModel.loginWithPhone(randomCredential.phone, 'not randomUser\'s password')
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });

      it('fails when given an invalid phone number', (done) => {
        credentialModel.loginWithPhone('this is definitely not a phone number', 'password')
            .then(() => {
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

  describe('createTemporary', () => {
    describe('success', () => {
      it('returns a credential object when given valid params', (done) => {
        const signupInfo = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'p@55w0rd',
        };

        credentialModel.createTemporary(signupInfo.phone, signupInfo.password)
            .then((credential) => {
              expect(credential.phone).to.equal(signupInfo.phone);
              expect(credential.password_hash).to.be.not.null;
              expect(credential.tfa_secret).to.be.not.null;
              done();
            })
            .catch(done);
      });

      it('fails when given an invalid phone number', (done) => {
        const signupInfo = {
          phone: '123a456b7890',
          password: 'p@55w0rd',
        };

        credentialModel.createTemporary(signupInfo.phone, signupInfo.password)
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });

      it('fails when given an invalid password', (done) => {
        const signupInfo = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'a',
        };

        credentialModel.createTemporary(signupInfo.phone, signupInfo.password)
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });
    });
  });

  describe('saveToDatabase', () => {
    describe('success', () => {
      it('accepts and saves a valid, non-existing credential', (done) => {
        const signupInfo = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'p@55w0rd',
        };

        // Register the credential, then log in to make sure it shows up in the DB
        credentialModel.createTemporary(signupInfo.phone, signupInfo.password)
            .then((credential) => credentialModel.saveToDatabase(credential))
            .then(() => credentialModel.loginWithPhone(signupInfo.phone, signupInfo.password))
            .then((credential) => credentialModel.findById(credential.id, ['phone']))
            .then((credential) => {
              expect(credential).to.be.not.null;
              expect(credential.phone).to.equal(signupInfo.phone);
              done();
            })
            .catch(done);
      });
    });
    describe('failure', () => {
      it('fails when given an existing phone number and password', (done) => {
        const randomCredential = randomItem(fixture.tables.credential);

        credentialModel.createTemporary(randomCredential.phone, 'password')
            .then((credential) => credentialModel.saveToDatabase(credential))
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });

      it('fails when given an invalid phone number', (done) => {
        const signupInfo = {
          phone: '123a456b7890',
          password: 'dajsfhjskdf',
        };

        credentialModel.createTemporary(signupInfo.phone, signupInfo.password)
            .then((credential) => credentialModel.save(credential))
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });

      it('fails when given an invalid password', (done) => {
        const signupInfo = {
          phone: '18610322136', // Known-valid Chinese phone number
          password: 'a',
        };

        credentialModel.createTemporary(signupInfo.phone, signupInfo.password)
            .then((credential) => credentialModel.save(credential))
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });

      it('fails when not given a phone number', (done) => {
        const signupInfo = {
          password: 'dajsfhjskdf',
        };

        credentialModel.createTemporary(signupInfo.phone, signupInfo.password)
            .then((credential) => credentialModel.save(credential))
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });

      it('fails when not given a password', (done) => {
        const signupInfo = {
          phone: '18610322136', // Known-valid Chinese phone number
        };

        credentialModel.createTemporary(signupInfo.phone, signupInfo.password)
            .then((credential) => credentialModel.save(credential))
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });
    });
  });

  describe('updatePhoneNumber', () => {
    describe('success', () => {
      it('updates the phone number of an existing credential', (done) => {
        // Pick a random credential from the fixture and try to update its phone number
        const randomCredential = randomItem(fixture.tables.credential);
        const newPhone = '18610322136';

        // Update the user
        credentialModel.updatePhoneNumber(randomCredential.id, newPhone)
            .then(() =>
                // Retrieve the updated user from the DB
                credentialModel.findById(randomCredential.id, ['phone'])
                    .then((credential) => {
                      // Ensure that the nickname is updated
                      expect(credential).not.to.be.null;
                      expect(credential.phone).to.equal(newPhone);
                      done();
                    })
            ).catch(done);
      });
    });

    describe('failure', () => {
      it('fails to update a nonexistent credential', (done) => {
        credentialModel.updatePhoneNumber(9999999, '18610322136')
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });

      it('fails to update when given an invalid phone number', (done) => {
        const randomCredential = randomItem(fixture.tables.credential);
        const newPhone = '123a456b7890';

        credentialModel.updatePhoneNumber(randomCredential.id, newPhone)
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });
    });
  });

  describe('updatePassword', () => {
    describe('success', () => {
      it('updates the password of an existing credential', (done) => {
        // Pick a random credential from the fixture and try to update its phone number
        const randomCredential = randomItem(fixture.tables.credential);
        const newPassword = 'p@55w0rd';

        // Update the user
        credentialModel.updatePassword(randomCredential.id, newPassword)
            .then(() =>
                // Retrieve the updated user from the DB
                credentialModel.findById(randomCredential.id, ['password_hash'])
                    .then((credential) => {
                      // Ensure that the nickname is updated
                      expect(credential).not.to.be.null;
                      // Ensure that the PW hash has changed
                      expect(credential.password_hash).not.to.equal(randomCredential.password_hash);
                      done();
                    })
            ).catch(done);
      });
    });

    describe('failure', () => {
      it('fails to update a nonexistent credential', (done) => {
        credentialModel.updatePhoneNumber(9999999, '18610322136')
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });

      it('fails to update when given an invalid password', (done) => {
        const randomCredential = randomItem(fixture.tables.credential);
        const newPassword = 'a';

        credentialModel.updatePhoneNumber(randomCredential.id, newPassword)
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
              done();
            });
      });
    });
  });

  describe('updateProfileId', () => {
    describe('success', () => {
      it('updates the profile of an existing credential if not set', (done) => {
        // Pick a credential from the fixture that does not have a profile
        const testCredential = fixture.tables.credential[0];
        const testProfileId = 1;

        // Update the user
        credentialModel.updateProfileId(testCredential.id, testProfileId)
            .then(() =>
              // Retrieve the updated user from the DB
                credentialModel.findById(testCredential.id, ['profile_id'])
                    .then((credential) => {
                      // Ensure that the profile id is updated
                      expect(credential).not.to.be.null;
                      // Ensure that the PW hash has changed
                      expect(credential.profile_id).to.equal(testProfileId);
                      done();
                    })
            ).catch(done);
      });
    });

    describe('failure', () => {
      it('fails to update a credential if already has a profile', (done) => {
        // Pick a credential from the fixture that already has a profile
        const testCredential = fixture.tables.credential[2];
        const testProfileId = 2;

        credentialModel.updateProfileId(testCredential, testProfileId)
            .then(() => {
              done(new Error('Did not fail when expected to'));
            }).catch(() => {
          done();
        });
      });
    });
  });
});
