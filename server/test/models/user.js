/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const assert = require('chai').assert;
const db = require('../../app/database');
const expect = require('chai').expect;
const fixture = require('../fixtures/user');
const userModel = require('../../app/models/user');

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

describe('User Model Tests', () => {
  beforeEach((done) => {
    // Truncate the user table
    db.truncate(['user'])
        // Import the fixture
        .then(() => db.importFixture(fixture))
        // Finish
        .then(done.bind(null, null))
        .catch(done);
  });

  after((done) => {
    db.truncate(['user'])
        .then(done.bind(null, null))
        .catch(done);
  });


  it('findById', (done) => {
    // Pick a random user from the fixture and try to log in as that user
    const randomUser = randomItem(fixture.tables.user);
    userModel.findById(randomUser.id, ['id']).then((user) => {
      expect(user.id).to.equal(randomUser.id);

      done();
    }).catch(done);
  });

  it('loginWithPhone', (done) => {
    // Pick a random user from the fixture and try to log in as that user
    const randomUser = randomItem(fixture.tables.user);

    // NOTE: Passwords are never stored in the user table, and thus, aren't in the table fixtures.
    // Thus, for convenience in this test, the test users' passwords are just their phone numbers.
    userModel.loginWithPhone(randomUser.phone, randomUser.phone).then((user) => {
      expect(user).to.not.be.null;
      expect(user.id).to.equal(randomUser.id);

      done();
    }).catch(done);
  });

  it('registerWithPhone', (done) => {
    // Insert a user into the DB with just the necessary information
    const newUser = {
      phone: '123-456-7890',
      password: 'p@55w0rd',
    };

    // Register the user, then log in to make sure it shows up in the DB
    userModel.registerWithPhone(newUser.phone, newUser.password)
        .then(() => userModel.loginWithPhone(newUser.phone, newUser.password))
        .then((user) => userModel.findById(user.id, ['phone']))
        .then((user) => {
          expect(user).to.be.not.null;
          expect(user.phone).to.equal(newUser.phone);
          done();
        })
        .catch(done);
  });

  it('updateById', (done) => {
    // Pick a random user from the fixture and try to update their phone number, adding a '!!!'
    const randomUser = randomItem(fixture.tables.user);
    const newPhone = `${randomUser.phone}!!!`;

    // Update the user
    userModel.updateById(randomUser.id, { phone: newPhone }).then(() =>
        // Retrieve the updated user from the DB
        userModel.findById(randomUser.id, ['phone']).then((user) => {
          // Ensure that the nickname is updated
          expect(user).not.to.be.null;
          expect(user.phone).to.equal(newPhone);
          done();
        })
    ).catch(done);
  });
});
