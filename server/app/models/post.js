const db = require('../database');
const date = require('../services/date');

/**
 * Create a post and associates it with an existing profile
 * @param pid {number} - The profile id of the user.
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
 * Associate a media resource to a post
 * @param postId {number} - ID of the post.
 * @param mediaId {Object} - ID of the media resource
 * @returns {Promise.<Object>}
 */
function addMediaToPost(postId, mediaId) {
  const queryString = 'INSERT INTO post_collection ( ?? ) values ( ? )';

  const relation = {
    post_id: postId,
    media_id: mediaId,
  };

  const columnNames = Object.keys(relation);
  const columnValues = columnNames.map((col) => relation[col]);

  return db.query(queryString, [columnNames, columnValues]);
}

/**
 * Find a post metadata given its unique ID
 * @param postId {number} - post ID of the post
 * @param columns {Array} - columns to retrieve from
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

/**
 * Find all media resources that are associated with the given post
 * @param postId {number} - post ID of the post
 * @param columns {Array} - array of columns to retrieve. Default to the resource name and location
 * @returns {Promise.<Array>}
 */
function findMediaForPost(postId, columns = ['name', 'cdn_location']) {
  const tables = 'post p, media m, post_collection pc';
  const selection = 'p.id = ? AND p.id = pc.post_id AND m.id = pc.media_id';
  const order = 'm.created_at';
  const queryString = `SELECT ?? FROM ${tables} WHERE ${selection} ORDER BY ${order}`;

  return db.query(queryString, [columns, postId]);
}

module.exports = {
  createPostForProfile,
  addMediaToPost,
  findById,
  findMediaForPost,
};
