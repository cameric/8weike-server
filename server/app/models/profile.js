const Promise = require('bluebird');
const validator = require('validator');

const config = require('../config/config');
const db = require('../database');
const credentialModel = require('./credential');

/**
 * Check whether the user profile is defined
 * @param uid {int64} - Find user profile using user ID
 * @returns {Promise.<user>} A promise inidicating whether user has a profile.
 */
function checkWithUid(uid) {
  return credentialModel.findById(uid, ['profile_id']).then((profile) => {
    if (!profile.profile_id) {
      return Promise.reject(new Promise.OperationalError(
        'User has not set up a profile yet!'
      ))
    }
    return Promise.resolve(profile.profile_id);
  });
}

/**
 * Find the profile using the user ID
 * @param uid {int64} - user ID
 * @param columns {Array.<String>} - A list of columns to retrieve.
 * @returns {Promise.<user>} A promise that returns a profile if fulfilled.
 */
function findByUid(uid, columns) {
  const queryString = 'SELECT ?? FROM profile WHERE id = ?';

  return checkWithUid(uid).then((pid) => {
    // IDs are unique, so we can automatically return the first element in `res` (if any).
    // The response will either be an individual user object, or null
    return db.query(queryString, [columns, pid]).then((res) => {
      if (res.length < 1) {
        return Promise.reject(new Promise.OperationalError(
            'No profile exists with the given user. This should never occur!'));
      } else if (res.length > 1) {
        return Promise.reject(new Promise.OperationalError(
            'Multiple profiles link to the same Id. This should never occur!'));
      }
      return res[0];
    });
  });
}

/**
 * Create a profile and initialize it with a nickname
 * @param uid {int64} - The uid of the user.
 * @param nickname {Object} - the nickname of user profile.
 * @returns {Promise.<Object>}
 */
function createProfileWithName(uid, nickname) {
  const queryString = 'INSERT INTO profile ( ?? ) values ( ? )';

  return credentialModel.findById(uid, ['is_verified', 'profile_id']).then((credential) => {
    if (!credential.is_verified) {
      return Promise.reject(new Promise.OperationalError(
          'User credential has not been verified!'
      ));
    } else if (credential.profile_id) {
      return Promise.reject(new Promise.OperationalError(
          'User profile already exists!'
      ));
    } else if (!nickname) {
      return Promise.reject(new Promise.OperationalError(
          'Nickname is not provided!'
      ));
      // TODO: add additional validation for nickname
    }
    return db.query(queryString, [['nickname'], [nickname]]);
  });
}

/**
 * Update the user profile given the user id.
 * @param uid {int64} - The ID of the user to update.
 * @param columns {Object} - An object representing the columns to update as key-value pairs.
 * @returns {Promise.<Object>}
 */
function updateByUid(uid, columns) {
  const queryString = 'UPDATE profile SET ? WHERE id = ?';

  return checkWithUid(uid).then((pid) => {
    return db.query(queryString, [columns, pid]).then((okPacket) => {
      if (okPacket.affectedRows < 1) {
        return Promise.reject(new Promise.OperationalError(
            'No profile exists with the given user. This should never occur!'));
      } else if (okPacket.affectedRows > 1) {
        return Promise.reject(new Promise.OperationalError(
            'Multiple profiles link to the same Id. This should never occur!'));
      }
      return Promise.resolve();
    });
  });
}
module.exports = {
  findByUid,
  createProfileWithName,
  updateByUid
};