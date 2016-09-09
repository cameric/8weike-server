const Promise = require('bluebird');
const speakeasy = require('speakeasy');
const validator = require('validator');

const bcrypt = Promise.promisifyAll(require('bcrypt'));
const config = require('../config/config');
const db = require('../database');

/**
 *
 * @param id {number} - The ID to search for.
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
    return Promise.resolve(res[0]);
  });
}

/**
 * Check whether the user profile is defined and returns the profile ID if exists
 * @param id {number} - the credential ID
 * @returns {Promise.<user>} A promise indicating whether user has a profile.
 */
function getProfileForId(id) {
  return findById(id, ['profile_id']).then((res) => {
    if (!res.profile_id) {
      return Promise.reject(new Promise.OperationalError(
          'User has not set up a profile yet!'
      ));
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
 * Checks if the given phone number is valid (i.e. non-null and valid in China)
 * @param phone {string}
 * @returns {Promise.<Object>}
 */
function validatePhoneNumber(phone) {
  if ((phone == null) || !validator.isMobilePhone(phone, 'zh-CN')) {
    return Promise.reject(new Promise.OperationalError('Invalid phone number.'));
  }
  return Promise.resolve();
}

/**
 * Checks if the given password is valid (i.e. non-null and more than 8 chars long)
 * @param password {string}
 * @returns {Promise.<Object>}
 */
function validatePassword(password) {
  if ((password == null) || !validator.isLength(password, { min: 8 })) {
    return Promise.reject(new Promise.OperationalError('Password too short.'));
  }
  return Promise.resolve();
}

/**
 * Returns a promise to save a credential in the database.
 * @param credential {Object}
 * @returns {Promise.<TResult>} - A promise that fulfills when the credential is inserted.
 */
function save(credential) {
  return validatePhoneNumber(credential.phone)
      .then(() => { // Validate PW hash length
        // All bcrypt hashes are 60 chars long
        const BCRYPT_HASH_LENGTH = 60;

        const pwHash = credential.password_hash;
        if ((pwHash == null)
            || !validator.isLength(pwHash, { min: BCRYPT_HASH_LENGTH, max: BCRYPT_HASH_LENGTH })) {
          return Promise.reject(new Promise.OperationalError(
              `Password hash is not length ${BCRYPT_HASH_LENGTH}.`));
        }
        return Promise.resolve();
      })
      .then(() => { // Validate secret length
        const SECRET_LENGTH = 32; // In base 32 TODO: Genericize this, somehow

        const secret = credential.tfa_secret;
        if ((secret == null)
            || !validator.isLength(secret, { min: SECRET_LENGTH, max: SECRET_LENGTH })) {
          return Promise.reject(new Promise.OperationalError(
              `Secret is not length ${SECRET_LENGTH}.`));
        }
        return Promise.resolve();
      })
      .then(() => {
        const queryString = 'INSERT INTO credential ( ?? ) VALUES ( ? )';

        const columnNames = Object.keys(credential);
        const columnValues = columnNames.map((col) => credential[col]);

        return db.query(queryString, [columnNames, columnValues]);
      });
}

/**
 * Creates a (temporary) credential object.
 * @param phone
 * @param password
 * @returns {Promise.<Object>}
 */
function create(phone, password) {
  return validatePhoneNumber(phone)
      .then(() => validatePassword(password))
      .then(() => bcrypt.hashAsync(password, config.crypto.bcryptSaltRounds))
      .then((hash) => {
        const credential = {
          phone,
          password_hash: hash,
          tfa_secret: speakeasy.generateSecret({ length: config.crypto.tfaSecretLength }).base32,
        };
        return Promise.resolve(credential);
      });
}

/**
 * Returns arbitrary columns for the credential with the given phone number.
 * @param phone {string}
 * @param columns {Array.<String>}
 * @returns {Promise.<Object>}
 */
function findByPhoneNumber(phone, columns) {
  const queryString = 'SELECT ?? FROM credential WHERE phone = ?';

  return db.query(queryString, [columns, phone]).then((res) => {
    if (res.length < 1) {
      return Promise.reject(new Promise.OperationalError(
          'No credential with the given phone number exists.'));
    } else if (res.length > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple credentials with the same phone number exist. This should never occur!'));
    }
    return Promise.resolve(res[0]);
  });
}

/**
 * Updates a credential, indexed by ID.
 * @param id {number} - The ID of the credential to update.
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

/**
 * Updates a credential's phone number.
 * @param id {number}
 * @param phone {string}
 */
function updatePhoneNumber(id, phone) {
  return validatePhoneNumber(phone)
      .then(() => updateById(id, { phone }));
}

/**
 * Updates a credential's password.
 * @param id {number}
 * @param password {string}
 */
function updatePassword(id, password) {
  return validatePassword(password)
      .then(() => bcrypt.hashAsync(password, config.crypto.bcryptSaltRounds))
      .then((hash) => updateById(id, { password_hash: hash }));
}

/**
 * Updates a credential's profileId.
 * @param id {number}
 * @param phone {string}
 */
function updateProfileId(id, profileId) {
  // TODO: Should we reject if the profile already set? In theory it should only be set once
  return updateById(id, { profile_id: profileId });
}

module.exports = {
  create,
  findByPhoneNumber,
  findById,
  getProfileForId,
  loginWithPhone,
  save,
  updatePassword,
  updatePhoneNumber,
  updateProfileId,
};
