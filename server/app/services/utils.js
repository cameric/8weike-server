const crypto = require('crypto');

function generateHash() {
  var currentDate = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  return crypto.createHash('sha1').update(currentDate + random).digest('hex');
}

module.exports = {
  generateHash,
};
