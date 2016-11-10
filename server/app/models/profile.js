const oneLine = require('common-tags/lib/oneLine');
const Promise = require('bluebird');

const credentialModel = require('./credential');
const db = require('../database');

/**
 * Create a profile and initialize it with some data
 * @param cid {number} - The credential id of the user.
 * @param columns {Object} - an object of data to insert
 * @returns {Promise.<Object>}
 */
function createProfileForCredential(cid, columns) {
  const queryString = 'INSERT INTO profile ( ?? ) values ( ? )';

  return credentialModel.findById(cid, ['profile_id']).then((credential) => {
    if (credential.profile_id) {
      return Promise.reject(new Promise.OperationalError(
          'Profile already exists!'
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
 * Find the profile using the unique profile ID
 * @param pid {number} - user profile ID
 * @param columns {Array.<String>} - A list of columns to retrieve.
 * @returns {Promise.<user>} A promise that returns a profile if fulfilled.
 */
function findById(pid, columns) {
  const queryString = oneLine`
    SELECT ??
    FROM profile
    WHERE id = ?`;

  // IDs are unique, so we can automatically return the first element in `res` (if any).
  // The response will either be an individual user object, or null
  return db.query(queryString, [columns, pid]).then((res) => {
    if (res.length < 1) {
      return Promise.reject(new Promise.OperationalError(
          'No profile exists with the given user.'));
    } else if (res.length > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple profiles link to the same ID. This should never occur!'));
    }
    return res[0];
  });
}

/**
 * Update the user profile given the unique profile id.
 * @param pid {number} - The ID of the profile to update
 * @param columns {Object} - An object representing the columns to update as key-value pairs.
 * @returns {Promise.<Object>}
 */
function updateById(pid, columns) {
  const queryString = oneLine`
    UPDATE profile SET ?
    WHERE id = ?`;

  return db.query(queryString, [columns, pid]).then((okPacket) => {
    if (okPacket.affectedRows < 1) {
      return Promise.reject(new Promise.OperationalError(
          'No profile exists with the given user.'));
    } else if (okPacket.affectedRows > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple profiles link to the same Id. This should never occur!'));
    }
    return Promise.resolve();
  });
}

/**
 * Find the profile using the user ID
 * @param cid {number} - user credential ID
 * @param columns {Array.<String>} - A list of columns to retrieve.
 * @returns {Promise.<user>} A promise that returns a profile if fulfilled.
 */
function findByCredential(cid, columns) {
  return credentialModel.getProfileForId(cid).then((pid) => findById(pid, columns));
}

/**
 * Update the user profile given the user id.
 * @param cid {number} - The ID of the credential to update.
 * @param columns {Object} - An object representing the columns to update as key-value pairs.
 * @returns {Promise.<Object>}
 */
function updateByCredential(cid, columns) {
  return credentialModel.getProfileForId(cid).then((pid) => updateById(pid, columns));
}

/**
 * Find a subset of posts that are associated with a profile. Note that this function
 * will handle pagination if provided.
 * @param pid {number} - The ID of the profile
 * @param columns {Object} - An object representing the columns to update as key-value pairs.
 * @param skip {number} - The number of elements to skip for pagination
 * @param limit {number} - The number of posts to fetch in this batch
 * @param order {String} - One of the following sorted types. Default to time
 *  - time: sort by post created time
 * @returns {Promise.<Object>}
 */
function findPostsByProfile(pid, columns, skip = 0, limit = 10, order = 'time') {
  // Default order by time
  let orderKey = null;
  switch (order) {
    case 'time':
      orderKey = 'created_at';
      break;
    default:
      orderKey = 'created_at';
  }

  const queryString = oneLine`
    SELECT ??
    FROM post p
    INNER JOIN (SELECT id AS profile_id FROM profile WHERE id = ?) pf
    WHERE p.profile_id = pf.profile_id
    ORDER BY ${orderKey}
    LIMIT ${limit} OFFSET ${skip}`;

  return db.query(queryString, [columns, pid]);
}

/**
 * A small aggregate function that finds the total number of posts that
 * associates with a particular id
 * @param pid {number} - The ID of the profile
 * @returns {Promise.<Object>}
 */
function findNumPostsByProfile(pid) {
  const queryString = oneLine`
    SELECT COUNT(*) AS postCount
    FROM post p, profile pf
    WHERE pf.id = ? AND p.profile_id = pf.id`;

  return db.query(queryString, [pid]).then((res) => {
    if (res.length < 1) {
      return Promise.reject(new Promise.OperationalError(
          'No entry returned from an aggregator. This should never occur!'));
    } else if (res.length > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple entries returned from an aggregator. This should never occur!'));
    }
    return res[0].postCount;
  });
}

module.exports = {
  createProfileForCredential,
  findById,
  updateById,
  findByCredential,
  updateByCredential,
  findPostsByProfile,
  findNumPostsByProfile,
};
