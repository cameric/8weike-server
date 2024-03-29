const crypto = require('crypto');

/**
 * Returns a SHA1 hash generated by a random number and timestamp.
 * @returns {String} - The generated SHA1 hash.
 */
function generateHashWithDate() {
  var currentDate = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  return crypto.createHash('sha1').update(`${currentDate}${random}`).digest('hex');
}

module.exports = {
  generateHashWithDate,
};
