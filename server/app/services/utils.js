const crypto = require('crypto');

function generateHashWithDate() {
  var currentDate = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  return crypto.createHash('sha1').update(`${currentDate}${random}`).digest('hex');
}

module.exports = {
  generateHashWithDate,
};
