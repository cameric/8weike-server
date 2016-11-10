const oneLine = require('common-tags/lib/oneLine');
const Promise = require('bluebird');

const db = require('../database');
const date = require('../services/date');

/**
 * Create a new media and associate it with CDN location and name
 * @param name {String} - The human-readable original name of the media
 * @param origName {String} - The name of the original resource stored on the CDN cloud (S3).
 * @param origLocation {String} - The CDN location to access the original resource
 * @returns {Promise.<Object>}
 */
function createMediaResource(name, origName, origLocation) {
  const queryString = 'INSERT INTO media ( ?? ) values ( ? )';

  // Associate profile id and created time with the data
  const mediaMetadata = {
    name,
    orig_name: origName,
    orig_location: origLocation,
    created_at: date.getCurrentDateInMySQLFormat(),
  };

  const columnNames = Object.keys(mediaMetadata);
  const columnValues = columnNames.map((col) => mediaMetadata[col]);

  return db.query(queryString, [columnNames, columnValues]);
}

/**
 * Find a media metadata given its unique ID
 * @param mediaId {number} - ID of the media resource
 * @param columns {Object} - columns to retrieve from
 * @returns {Promise.<Object>}
 */
function findById(mediaId, columns) {
  const queryString = oneLine`
    SELECT ??
    FROM media
    WHERE id = ?`;

  return db.query(queryString, [columns, mediaId]).then((res) => {
    if (res.length < 1) {
      return Promise.reject(new Promise.OperationalError(
          'No media exists with the given ID.'));
    } else if (res.length > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple media resources with same ID. This should never occur!'));
    }
    return res[0];
  });
}

/**
 * Update a media metadata given its unique ID
 * @param mediaId {number} - ID of the media resource
 * @param columns {Object} - columns to update
 * @returns {Promise.<Object>}
 */
function updateById(mediaId, columns) {
  const queryString = oneLine`
    UPDATE media SET ?
    WHERE id = ?`;

  return db.query(queryString, [columns, mediaId]).then((okPacket) => {
    if (okPacket.affectedRows < 1) {
      return Promise.reject(new Promise.OperationalError(
          'No media exists with the given id.'));
    } else if (okPacket.affectedRows > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple media entries link to the same Id. This should never occur!'));
    }
    return Promise.resolve();
  });
}

module.exports = {
  createMediaResource,
  findById,
  updateById,
};
