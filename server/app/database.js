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
  const formattedQuery = mysql.format(queryString, substitutions);
  console.log(`Performing SQL query: ${formattedQuery}`);

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
  const truncateTable = (conn, table) => new Promise((fulfill, reject) => {
    const queryString = 'TRUNCATE TABLE ?';

    conn.query(queryString, [table], (err, res) => {
      if (err) reject(err);
      else fulfill(res);
    });
  });

  return getConnection().then((conn) =>
      Promise.all(tables.map(truncateTable.bind(null, conn))));
}

function importFixture(fixture) {
  const insertRow = (conn, tableName, row) => new Promise((fulfill, reject) => {
    const queryString = 'INSERT INTO ? ( ? ) VALUES ( ? )';

    conn.query(queryString, [tableName, row.keys(), row.values()], (err, res) => {
      if (err) reject(err);
      else fulfill(null, res);
    });
  });

  // Get a connection
  return getConnection().then((conn) =>
      // For all tables
      Promise.all(Object.keys(fixture.tables).map((tableName) =>
          // For all rows in the table
          Promise.all(fixture.tables[tableName].map(insertRow.bind(null, conn, tableName))))));
}

module.exports = {
  getConnection,
  importFixture,
  query,
  truncate,
};
