// Create and verify captcha using ccap
// Note(tonyzhang): the reason that we could not use reCaptcha is that it's a
// Google service. Whenever the service is available in mainland China,
// We chould switch to it.

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const ccap = require('ccap');

const config = require('../config/config');

/**
 * Generate a Captcha image and corresponding encrypted value.
 * @param options {object} an object of options fed into ccap.
 *        see https://github.com/DoubleSpout/ccap for more info.
 * @return {Promise.<TResult>} Whether the captcha is generated successfully
 */
function get(options) {
  const [text, picture] = ccap(options).get();

  // Send back hashed text and picture
  return bcrypt.hashAsync(text, config.encrypt.bcryptSaltRounds).then((hash) => {
    return {
      hash,
      picture: picture.toString('base64'),
    };
  });
}

/**
 * Verify a Captcha against its encrypted original value.
 * @param captcha {string} the user-inputed captcha.
 * @param hash {string} the original hash.
 * @return {Promise.<TResult>} Whether the user put in the correct captcha value.
 */
function verify(captcha, hash) {
  // Verify user response against original hash
  return bcrypt.compareAsync(captcha, hash).then((valid) => {
    if (valid) return Promise.resolve();
    return Promise.reject(new Promise.OperationalError('Incorrect captcha response!'));
  });
}

module.exports = {
  get,
  verify,
};
