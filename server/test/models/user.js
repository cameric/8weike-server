/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

const assert = require('chai').assert;
const db = require('../../app/database');
const expect = require('chai').expect;
const fixture = require('../fixtures/user');
const userModel = require('../../app/models/user');

function randomItem(array) {
  return array[Math.floor(Math.random()*array.length)];
}

describe('User Model Tests', function() {
  beforeEach((done) => {
    db.truncate(['user'])
        .then(db.importFixture(fixture))
        .then(done.bind(null, null))
        .catch(done);
  });

  it('findById', (done) => {
    // Pick a random user from the fixture and try to log in as that user
    const randomUser = randomItem(fixture.tables.user);
    userModel.findById(randomUser.id, ['*']).then((user) => {
      expect(user).to.not.be.null;
      expect(user.id).to.equal(randomUser.id);
      done();
    }).catch((err) => {
      assert.fail(err);
      done();
    });
  });

  it('loginWithPhone', (done) => {
    // Pick a random user from the fixture and try to log in as that user
    const randomUser = randomItem(fixture.tables.user);
    userModel.loginWithPhone(randomUser.phone, randomUser.password).then((user) => {
      expect(user).to.not.be.null;
      done();
    }).catch((err) => {
      assert.fail(err);
      done();
    });
  });

  it('register', (done) => {
    // Insert a user into the DB with just the necessary information
    const newUser = {
      phone: '123-456-7890',
      password: 'p@55w0rd',
    };
    userModel.register(newUser).then((_) => userModel.findById(fixture.tables.user.length + 1))
        .then((user) => {
          expect(user).to.be.not.null;
          expect(user.phone).to.equal(newUser.phone);
          expect(user.password).to.equal(newUser.password);
          done();
        }).catch((err) => {
          assert.fail(err);
          done();
        });
  });

  it('updateById', (done) => {
    // Pick a random user from the fixture and try to update their phone number, adding a '!!!'
    const randomUser = randomItem(fixture.tables.user);
    const newPhone = `${randomUser.phone}!!!`;

    // Update the user
    userModel.updateById(randomUser.id, { phone: newPhone }).then((_) =>
        // Retrieve the updated user from the DB
        userModel.findById(randomUser.id, ['phone']).then((user) => {
          // Ensure that the nickname is updated
          expect(user.phone).to.equal(newPhone);
          done();
        })
    ).catch((err) => {
      assert.fail(err);
      done();
    });
  });
});
