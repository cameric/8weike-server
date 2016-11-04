const db = require('../database');
const date = require('../services/date');

/**
 * Create a post and associates it with an existing profile
 * @param pid {number} - The credential id of the user.
 * @param columns {Object} - an object of data to insert
 * @returns {Promise.<Object>}
 */
function createPostForProfile(pid, columns) {
  const queryString = 'INSERT INTO post ( ?? ) values ( ? )';

  // Associate profile id and created time with the data
  const postData = columns;
  postData.profile_id = pid;
  postData.created_at = date.getCurrentDateInMySQLFormat();

  const columnNames = Object.keys(postData);
  const columnValues = columnNames.map((col) => postData[col]);

  return db.query(queryString, [columnNames, columnValues]);
}

module.exports = {
  createPostForProfile,
};
