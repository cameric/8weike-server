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
  const queryPromise = (conn, str, substitution) => {
    denodeify(conn.query.bind(conn), (err, res) => {
      conn.release();
      return [err, res];
    })(str, substitution);
  };

  return getConnection().then((conn) => queryPromise(conn, queryString, substitutions));
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
    const queryPromise = denodeify(conn.query.bind(conn));

    return queryPromise(queryString, [table]);
  };

  // A promise to truncate all tables
  const truncateAllTables = (conn) => Promise.all(tables.map(truncateTable.bind(null, conn)));

  return getConnection().then(truncateAllTables);
}

function importFixture(fixture) {
  // A promise to insert a given row into a table
  const insertRow = (conn, tableName, row) => {
    const columnNames = Object.keys(row);
    const columnValues = columnNames.map((col) => row[col]);

    const queryString = 'INSERT INTO ?? ( ?? ) VALUES ( ? )';
    const queryPromise = denodeify(conn.query.bind(conn));

    return queryPromise(queryString, [tableName, columnNames, columnValues]);
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

  return getConnection().then(importAllTables);
}

module.exports = {
  getConnection,
  importFixture,
  query,
  truncate,
};
