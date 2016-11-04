// This service provides a set of backend services that
// relates to date and time

const moment = require('moment');

function getCurrentDateInMySQLFormat() {
  return moment().format('YYYY-MM-DD H:mm:ss');
}

module.exports = {
  getCurrentDateInMySQLFormat,
};
