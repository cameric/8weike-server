// eslint-disable-next-line import/no-extraneous-dependencies
const config = require('app/config/config');
const mysql = require('mysql');

const pool = mysql.createPool(config.mysql);

function getConnection(callback) {
  pool.getConnection((err, conn) => callback(err, conn));
}

function testConnection(callback) {
  // Create a temporary connection
  const connection = mysql.createConnection(config.mysql);
  connection.connect((err) => {
    connection.end();
    callback(err);
  });
}

module.exports = {
  getConnection,
  testConnection,
};
