const bcrypt = require('bcrypt');
const db = require('../database');
const denodeify = require('denodeify');

/**
 *
 * @param id {int64} - The ID to search for.
 * @param columns {Array.<String>} - A list of columns to retrieve.
 * @returns {Promise.<user>} A promise that returns a user if fulfilled.
 */
function findById(id, columns) {
  const queryString = 'SELECT ?? FROM user WHERE id = ?';

  // IDs are unique, so we can automatically return the first element in `res` (if any).
  // The response will either be an individual user object, or null
  return db.query(queryString, [columns, id]).then((res) => res[0]);
}

/**
 * Promise: If a user exists whose phone/password match the given parameters, fulfills and returns
 *  that user's ID, otherwise rejects.
 * @param phone {string}
 * @param password {string}
 * @returns {Promise.<TResult>}
 */
function loginWithPhone(phone, password) {
  // Promise to check a plaintext password against a user's current password hash
  const check = denodeify(bcrypt.compare);

  // Find a user with the given phone number, if any, and check the password.
  const queryString = 'SELECT id, password_hash FROM user WHERE phone = ?';
  return db.query(queryString, [phone]).then((user) => {
    if (!user) throw new Error('No user with the given phone number exists.');
    return check(password, user.password_hash).then((valid) => {
      if (!valid) throw new Error('Invalid password.');
      return { id: user.id };
    });
  });
}

/**
 * Returns a promise to register a new user in the database.
 * @param phone {string} - The new user's phone number.
 * @param password {string} - The new user's password.
 * @returns {Promise.<TResult>} - A promise that fulfills when the user is successfully reigstered.
 */
function registerWithPhone(phone, password) {
  const hashPassword = denodeify(bcrypt.hash);
  const queryString = 'INSERT INTO pending_user ( ?? ) VALUES ( ? )';
  const saltRounds = 12; // TODO: move this somewhere sane

  return hashPassword(password, saltRounds).then((hash) => {
    const user = {
      phone,
      password_hash: hash,
    };
    const columnNames = Object.keys(user);
    const columnValues = columnNames.map((col) => user[col]);

    return db.query(queryString, [columnNames, columnValues]);
  });
}

/**
 *
 * @param id {int64} - The ID of the user to update.
 * @param columns {Object} - An object representing the columns to update as key-value pairs.
 * @returns {Promise.<Object>}
 */
function updateById(id, columns) {
  const queryString = 'UPDATE user SET ? WHERE id = ?';
  return db.query(queryString, [columns, id]);
}

module.exports = {
  findById,
  loginWithPhone,
  registerWithPhone,
  updateById,
};