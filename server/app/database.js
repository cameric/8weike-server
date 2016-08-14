// eslint-disable-next-line import/no-extraneous-dependencies
const config = require('../config/config');
const mysql = require('mysql');

const pool = mysql.createPool(config.mysql);

/**
 * Callback for database access.
 * @callback dbCallback
 * @param err - Error, if any.
 * @param res - The result of the query.
 */

/**
 * Gets a connection from the pool and automatically releases it after use by the callback.
 * @param callback {dbCallback}
 */
function getConnection(callback) {
  pool.getConnection((err, conn) => {
    if (err) return callback(err);

    // Run the callback, but return only after releasing the connection
    callback(null, conn);
    return conn.release();
  });
}

/**
 * Gets a connection, performs a single query, and releases the connection. Common use case.
 * @param queryString {string} - The query to perform.
 * @param substitutions {Array.<Object>} - Substitutions to be made into the query string.
 * @param callback {dbCallback} - The callback to run upon an error or result from the DB.
 */
function singleQuery(queryString, substitutions, callback) {
  getConnection((err, conn) => {
    if (err) return callback(err);

    // eslint-disable-next-line no-shadow
    return conn.query(queryString, substitutions, (err, user) => {
      if (err) return callback(err);
      return callback(null, user);
    });
  });
}

module.exports = {
  getConnection,
  singleQuery,
};
