/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const app = require('../../app');
const db = require('../../app/database');
const fixture = require('../fixtures/user');
const request = require('supertest');

describe('Profile Routing', () => {
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

  describe('POST /api/profile/create', () => {
    const fixtureNickname = 'Harry Potter';

    function loginUser(agent, credential) {
      return new Promise((reject, fulfill) => {
        const data = {
          phone: credential.phone,
          // In the fixture, all users' phone numbers are their passwords
          password: credential.phone,
        };

        agent
            .post('/api/login/phone')
            .send(data)
            .expect(200)
            .end((err, _) => {
              if (err) return reject(err);
              return fulfill();
            });
      });
    }

    describe('Valid input', () => {
      const agent = request.agent(app);
      // This is a verified user that does not have an associated profile
      const testCredential = fixture.tables.credential[1];

      it('(200) Success when a logged in user creates a profile', (done) => {
        loginUser(agent, testCredential).then(() => {
          const data = {
            uid: testCredential.uid,
            nickname: fixtureNickname,
          };

          agent
              .post('/api/profile/create')
              .send(data)
              .expect(200)
              .end((err, _) => {
                if (err) return done(err);
                return done();
              });
        }).catch(done);
      });
    });

    describe('Invalid input', () => {
      const agent = request.agent(app);
      // This is a verified user that does not have an associated profile
      const testCredential = fixture.tables.credential[1];

      it('(400) responds with Bad Request when nickname is not provided', (done) => {
        loginUser(agent, testCredential).then(() => {
          const data = {
            uid: testCredential.uid,
          };

          agent
              .post('/api/profile/create')
              .send(data)
              .expect(400)
              .end((err, _) => {
                if (err) return done(err);
                return done();
              });
        }).catch(done);
      });
    });

    describe('Unauthorized user', () => {
      it('(401) responds with Unauthorized when user has not logged in', (done) => {
        // This is a verified user that does not have an associated profile
        const testCredential = fixture.tables.credential[1];

        const data = {
          uid: testCredential.uid,
          nickname: fixtureNickname,
        };

        // use request here to remove logged in state
        request(app)
            .post('/api/profile/create')
            .send(data)
            .expect(401)
            .end((err, _) => {
              if (err) return done(err);
              return done();
            });
      });
    });


    describe('Verified user', () => {
      const agent = request.agent(app);
      // This is a verified user that has an associated profile
      const testCredential = fixture.tables.credential[2];

      it('(400) responds with Bad Request when user already has a profile', (done) => {
        loginUser(agent, testCredential).then(() => {
          const data = {
            uid: testCredential.uid,
            nickname: fixtureNickname,
          };

          agent
              .post('/api/profile/create')
              .send(data)
              .expect(400)
              .end((err, _) => {
                if (err) return done(err);
                return done();
              });
        });
      });
    });
  });
});
