const Promise = require('bluebird');
const speakeasy = require('speakeasy');
const validator = require('validator');

const bcrypt = Promise.promisifyAll(require('bcrypt'));
const config = require('../config/config');
const db = require('../database');

/**
 *
 * @param id {int64} - The ID to search for.
 * @param columns {Array.<String>} - A list of columns to retrieve.
 * @returns {Promise.<user>} A promise that returns a user if fulfilled.
 */
function findById(id, columns) {
  const queryString = 'SELECT ?? FROM credential WHERE id = ?';

  // IDs are unique, so we can automatically return the first element in `res` (if any).
  // The response will either be an individual user object, or null
  return db.query(queryString, [columns, id]).then((res) => {
    if (res.length < 1) {
      return Promise.reject(new Promise.OperationalError('No user with the given ID exists.'));
    } else if (res.length > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple users with the same ID exist. This should never occur!'));
    }
    return res[0];
  });
}

/**
 * Check whether the user profile is defined and returns the profile ID if exists
 * @param id {int64} - the credential ID
 * @returns {Promise.<user>} A promise indicating whether user has a profile.
 */
function getProfileForId(id) {
  return findById(id, ['profile_id']).then((res) => {
    if (!res.profile_id) {
      return Promise.reject(new Promise.OperationalError(
          'User has not set up a profile yet!'
      ))
    }
    return Promise.resolve(res.profile_id);
  });
}

/**
 * Promise: If a user exists whose phone/password match the given parameters, fulfills and returns
 *  that user's ID, otherwise rejects.
 * @param phone {string}
 * @param password {string}
 * @returns {Promise.<TResult>}
 */
function loginWithPhone(phone, password) {
  // Find a user with the given phone number, if any, and check the password.
  const queryString = 'SELECT id, password_hash FROM credential WHERE phone = ?';
  return db.query(queryString, [phone]).then((results) => {
    if (!results || !results[0]) {
      return Promise.reject(
          new Promise.OperationalError('No user with the given phone number exists.'));
    }

    // password_hash is stored as a binary buffer in the SQL table
    const user = results[0];
    return bcrypt.compareAsync(password, user.password_hash).then((valid) => {
      if (!valid) {
        return Promise.reject(
            new Promise.OperationalError('Invalid password.'));
      }

      return { id: user.id };
    });
  });
}

/**
 * Returns a promise to signup a new user in the database.
 * @param phone {string} - The new user's phone number.
 * @param password {string} - The new user's password.
 * @returns {Promise.<TResult>} - A promise that fulfills when the user is successfully registered.
 */
function signupWithPhone(phone, password) {
  // TODO: Move password length and locale to config
  if ((phone == null) || !validator.isMobilePhone(phone, 'zh-CN')) {
    return Promise.reject(new Promise.OperationalError('Invalid phone number.'));
  } else if ((password == null) || !validator.isLength(password, { min: 8 })) {
    return Promise.reject(new Promise.OperationalError('Password too short.'));
  }

  // Hash the password and create the new credential
  const queryString = 'INSERT INTO credential ( ?? ) VALUES ( ? )';

  return bcrypt.hashAsync(password, config.encrypt.bcryptSaltRounds).then((hash) => {
    const user = {
      phone,
      password_hash: hash,
      tfa_secret: speakeasy.generateSecret({ length: 20 }).base32, // TODO: move length to config
    };
    const columnNames = Object.keys(user);
    const columnValues = columnNames.map((col) => user[col]);

    return db.query(queryString, [columnNames, columnValues]);
  });
}

/**
 *
 * @param id {int64} - The ID of the credential to update.
 * @param columns {Object} - An object representing the columns to update as key-value pairs.
 * @returns {Promise.<Object>}
 */
function updateById(id, columns) {
  const queryString = 'UPDATE credential SET ? WHERE id = ?';
  return db.query(queryString, [columns, id]).then((okPacket) => {
    if (okPacket.affectedRows < 1) {
      return Promise.reject(new Promise.OperationalError('No user with the given ID exists.'));
    } else if (okPacket.affectedRows > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple users with the same ID exist. This should never occur!'));
    }
    return Promise.resolve();
  });
}



module.exports = {
  findById,
  getProfileForId,
  loginWithPhone,
  signupWithPhone,
  updateById,
};
