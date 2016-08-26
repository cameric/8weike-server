// eslint-disable-next-line import/no-extraneous-dependencies
const Promise = require('bluebird');

const config = require('./config/config');

// We need to promisify mysql and its classes manually.
// See http://bluebirdjs.com/docs/api/promisification.html
const mysql = Promise.promisifyAll(require('mysql'));
// For reasons unknown, the actual prototypes don't get updated in the Webpack-bundled version,
// so we have to use Connection.queryAsync.call(connection, args...) etc rather than just
// connection.queryAsync(args...).
const Connection = Promise.promisifyAll(require('mysql/lib/Connection').prototype);
const Pool = Promise.promisifyAll(require('mysql/lib/Pool').prototype);

const pool = mysql.createPool(config.mysql);

/**
 * Gets a connection from the pool.
 * @returns {Promise.<mysql.Connection>} A promise to return a connection.
 */
function getConnection() {
  return Pool.getConnectionAsync.call(pool).disposer((conn) => {
    conn.release();
  });
}

function testConnection() {
  // Do nothing if we can successfully get a connection; otherwise the resulting error is passed to
  // the catch() block
  const doNothing = () => Promise.resolve();

  return Promise.using(getConnection(), doNothing);
}

/**
 * Gets a connection, performs a single query, and releases the connection. Common use case.
 * @param queryString {string} - The query to perform.
 * @param substitutions {Array.<Object>} - Substitutions to be made into the query string.
 * @returns {Promise.<Object>} A promise to return a query response.
 */
function query(queryString, substitutions) {
  const doQuery = (conn) => Connection.queryAsync.call(conn, queryString, substitutions);

  return Promise.using(getConnection(), doQuery);
}

/**
 * Truncates the given tables (i.e. deletes all rows but keeps the tables).
 * @param tables {Array.<String>} - A list of tables to truncate.
 * @returns {Promise.<Object>} A promise to return a query response.
 */
function truncate(tables) {
  // A promise to truncate the given table
  const truncateTable = (conn, table) => {
    const queryString = 'TRUNCATE TABLE ??';
    return Connection.queryAsync.call(conn, queryString, [table]);
  };

  // A promise to truncate all tables
  const truncateAllTables = (conn) => Promise.all(tables.map(truncateTable.bind(null, conn)));

  return Promise.using(getConnection(), truncateAllTables);
}

function importFixture(fixture) {
  // A promise to insert a given row into a table
  const insertRow = (conn, tableName, row) => {
    const columnNames = Object.keys(row);
    const columnValues = columnNames.map((col) => row[col]);

    const queryString = 'INSERT INTO ?? ( ?? ) VALUES ( ? )';

    return Connection.queryAsync.call(conn, queryString, [tableName, columnNames, columnValues]);
  };

  // A promise to insert an individual row into the given DB table using the given connection
  const insertAllRows = (conn, tableName) => {
    const rows = fixture.tables[tableName];
    return Promise.all(rows.map(insertRow.bind(null, conn, tableName)));
  };

  // A promise to import rows from all tables specified in the fixture
  const importAllTables = (conn) => {
    const tableNames = Object.keys(fixture.tables);
    return Promise.all(tableNames.map(insertAllRows.bind(null, conn)));
  };

  return Promise.using(getConnection(), importAllTables);
}

module.exports = {
  getConnection,
  importFixture,
  query,
  testConnection,
  truncate,
};
