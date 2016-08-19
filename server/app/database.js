// eslint-disable-next-line import/no-extraneous-dependencies
const config = require('./config/config');
const denodeify = require('denodeify');
const mysql = require('mysql');

const pool = mysql.createPool(config.mysql);

/**
 * Gets a connection from the pool.
 * @returns {Promise.<mysql.Connection>} A promise to return a connection.
 */
function getConnection() {
  return denodeify(pool.getConnection.bind(pool))();
}

/**
 * Gets a connection, performs a single query, and releases the connection. Common use case.
 * @param queryString {string} - The query to perform.
 * @param substitutions {Array.<Object>} - Substitutions to be made into the query string.
 * @returns {Promise.<Object>} A promise to return a query response.
 */
function query(queryString, substitutions) {
  return getConnection().then((conn) => new Promise((fulfill, reject) => {
    conn.query(queryString, substitutions, (err, res) => {
      conn.release();

      if (err) reject(err);
      else fulfill(res);
    });
  }));
}

/**
 * Truncates the given tables (i.e. deletes all rows but keeps the tables).
 * @param tables {Array.<String>} - A list of tables to truncate.
 * @returns {Promise.<Object>} A promise to return a query response.
 */
function truncate(tables) {
  // A promise to truncate the given table
  const queryString = 'TRUNCATE TABLE ??';
  const truncateTable = (conn, table) => denodeify(conn.query.bind(conn))(queryString, [table]);

  // A promise to truncate all tables
  const truncateAllTables = (conn) => Promise.all(tables.map(truncateTable.bind(null, conn)));

  return getConnection().then(truncateAllTables);
}

function importFixture(fixture) {
  // A promise to insert an individual row into the given DB table using the given connection
  const insertRow = (conn, tableName, row) => {
    const columnNames = Object.keys(row);
    const columnValues = columnNames.map((col) => row[col]);

    const queryString = 'INSERT INTO ?? ( ?? ) VALUES ( ? )';
    return denodeify(conn.query.bind(conn))(queryString, [tableName, columnNames, columnValues]);
  };

  // A promise to insert all rows of the table in the fixture into the corresponding table in the DB
  const insertAllRows = (conn, tableName) =>
      Promise.all(fixture.tables[tableName].map(insertRow.bind(null, conn, tableName)));

  // A promise to import rows from all tables specified in the fixture
  const importAllTables = (conn) =>
      Promise.all(Object.keys(fixture.tables).map(insertAllRows.bind(null, conn)));

  // Get a connection
  return getConnection().then(importAllTables);
}

module.exports = {
  getConnection,
  importFixture,
  query,
  truncate,
};
