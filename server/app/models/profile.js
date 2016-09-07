const Promise = require('bluebird');
const validator = require('validator');

const config = require('../config/config');
const credentialModel = require('./credential');
const db = require('../database');

/**
 * Create a profile and initialize it with some data
 * @param uid {int64} - The uid of the user.
 * @param columns {Object} - an object of data to insert
 * @returns {Promise.<Object>}
 */
function createProfile(uid, columns) {
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
    } else if (!columns.nickname) {
      return Promise.reject(new Promise.OperationalError(
          'Nickname is not provided!'
      ));
      // TODO: add additional validation for nickname
    }

    const columnNames = Object.keys(columns);
    const columnValues = columnNames.map((col) => columns[col]);
    return db.query(queryString, [columnNames, columnValues]);
  });
}

/**
 * Find the profile using the user ID
 * @param cid {int64} - user credential ID
 * @param columns {Array.<String>} - A list of columns to retrieve.
 * @returns {Promise.<user>} A promise that returns a profile if fulfilled.
 */
function findByCredentialId(cid, columns) {
  const queryString = 'SELECT ?? FROM profile WHERE id = ?';

  return credentialModel.getProfileForCredential(cid).then((pid) => {
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
 * Update the user profile given the user id.
 * @param cid {int64} - The ID of the credential to update.
 * @param columns {Object} - An object representing the columns to update as key-value pairs.
 * @returns {Promise.<Object>}
 */
function updateByCredentialId(cid, columns) {
  const queryString = 'UPDATE profile SET ? WHERE id = ?';

  return credentialModel.getProfileForCredential(cid).then((pid) => {
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
  createProfile,
  findByCredentialId,
  updateByCredentialId
};