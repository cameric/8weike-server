/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
const app = require('../../app');
const db = require('../../app/database');
const fixture = require('../fixtures/user');
const request = require('supertest');
const utils = require('../utils');

describe('Profile Routing', () => {
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
    db.truncate(['credential', 'profile'])
        .then(done.bind(null, null))
        .catch(done);
  });

  describe('POST /api/profile', () => {
    const fixtureNickname = 'Harry Potter';

    describe('Valid input', () => {
      const agent = request.agent(app);
      // This is a verified credential that does not have an associated profile
      const testCredential = fixture.tables.credential[1];

      it('(200) Success when a logged-in credential creates a profile', (done) => {
        utils.loginWithAgent(agent, testCredential).then(() => {
          const data = {
            id: testCredential.id,
            nickname: fixtureNickname,
          };

          agent
              .post('/api/profile')
              .send(data)
              .expect(200)
              .end((err, _) => {
                if (err) done(err);
                else done();
              });
        }).catch(done);
      });
    });

    describe('Invalid input', () => {
      const agent = request.agent(app);
      // This is a verified credential that does not have an associated profile
      const testCredential = fixture.tables.credential[1];

      it('(400) responds with Bad Request when nickname is not provided', (done) => {
        utils.loginWithAgent(agent, testCredential).then(() => {
          const data = {
            id: testCredential.id,
          };

          agent
              .post('/api/profile')
              .send(data)
              .expect(400)
              .end((err, _) => {
                if (err) done(err);
                else done();
              });
        }).catch(done);
      });
    });

    describe('Unauthorized credential', () => {
      it('(401) responds with Unauthorized when credential has not logged in', (done) => {
        // This is a verified credential that does not have an associated profile
        const testCredential = fixture.tables.credential[1];

        const data = {
          id: testCredential.id,
          nickname: fixtureNickname,
        };

        // use request here to remove logged in state
        request(app)
            .post('/api/profile')
            .send(data)
            .expect(401)
            .end((err, _) => {
              if (err) done(err);
              else done();
            });
      });
    });


    describe('Verified credential', () => {
      const agent = request.agent(app);
      // This is a verified credential that has an associated profile
      const testCredential = fixture.tables.credential[2];

      it('(400) responds with Bad Request when credential already has a profile', (done) => {
        utils.loginWithAgent(agent, testCredential).then(() => {
          const data = {
            id: testCredential.id,
            nickname: fixtureNickname,
          };

          agent
              .post('/api/profile')
              .send(data)
              .expect(400)
              .end((err, _) => {
                if (err) done(err);
                else done();
              });
        }).catch(done);
      });
    });
  });
});
