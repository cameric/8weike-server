// eslint-disable-next-line import/no-extraneous-dependencies
const config = require('./config/config');
const mysql = require('mysql');

const pool = mysql.createPool(config.mysql);

/**
 * Gets a connection from the pool.
 * @returns {Promise.<mysql.Connection>} A promise to return a connection.
 */
function getConnection() {
  return new Promise((fulfill, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err);
      else fulfill(conn);
    });
  });
}

/**
 * Gets a connection, performs a single query, and releases the connection. Common use case.
 * @param queryString {string} - The query to perform.
 * @param substitutions {Array.<Object>} - Substitutions to be made into the query string.
 * @returns {Promise.<Object>} A promise to return a query response.
 */
function query(queryString, substitutions) {
  return new Promise((fulfill, reject) => {
    getConnection().then((conn) =>
        conn.query(queryString, substitutions, (err, res) => {
          conn.release();

          if (err) reject(err);
          else fulfill(res);
        })
    ).catch(reject);
  });
}

/**
 * Truncates the given tables (i.e. deletes all rows but keeps the tables).
 * @param tables {Array.<String>} - A list of tables to truncate.
 * @returns {Promise.<Object>} A promise to return a query response.
 */
function truncate(tables) {
  return getConnection().then((conn) => {
    const queryString = 'TRUNCATE TABLE ?';

    // eslint-disable-next-line arrow-body-style new-cap
    // For all tables
    return Promise.all(tables.map((table) =>
      //
      new Promise((fulfill, reject) => {
        conn.query(queryString, [table], (err, res) => {
          if (err) reject(err);
          else fulfill(res);
        });
      })
    ));
  });
}

function importFixture(fixture) {
  const queryString = 'INSERT INTO ? ( ? ) VALUES ( ? )';

  return getConnection().then((conn) =>
      // For all table fixtures
      Promise.all(Object.keys(fixture.tables).map((tableName) =>
          // Get each row
          Promise.all(fixture.tables[tableName].map((row) =>
              // Insert the row into the corresponding table in the DB
              new Promise((fulfill, reject) => {
                conn.query(queryString, [tableName, row.keys(), row.values()], (err, res) => {
                  if (err) reject(err);
                  else fulfill(null, res);
                });
              })
          ))
      ))
  );
}

module.exports = {
  getConnection,
  importFixture,
  query,
  truncate,
};
