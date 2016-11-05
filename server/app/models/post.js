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

  if (!columns.title) {
    return Promise.reject(new Promise.OperationalError(
        'Title for post not provided!'
    ));
  }

  // Associate profile id and created time with the data
  const postData = columns;
  postData.profile_id = pid;
  postData.created_at = date.getCurrentDateInMySQLFormat();

  const columnNames = Object.keys(postData);
  const columnValues = columnNames.map((col) => postData[col]);

  return db.query(queryString, [columnNames, columnValues]);
}

/**
 * Find a post given its unique ID
 * @param postId {number} - post ID of the post
 * @param columns {Object} - columns to retrieve from
 * @returns {Promise.<Object>}
 */
function findById(postId, columns) {
  const queryString = 'SELECT ?? FROM post WHERE id = ?';

  return db.query(queryString, [columns, postId]).then((res) => {
    if (res.length < 1) {
      return Promise.reject(new Promise.OperationalError(
          'No post exists with the given ID.'));
    } else if (res.length > 1) {
      return Promise.reject(new Promise.OperationalError(
          'Multiple posts with same ID. This should never occur!'));
    }
    return res[0];
  });
}

module.exports = {
  createPostForProfile,
  findById,
};
