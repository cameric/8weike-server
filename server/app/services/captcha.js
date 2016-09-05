// Create and verify captcha using ccap
// Note(tonyzhang): the reason that we could not use reCaptcha is that it's a
// Google service. Whenever the service is available in mainland China,
// We chould switch to it.

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const ccap = require('ccap');

const config = require('../config/config');

function get(options) {
  const [ text, picture ] = ccap(options).get();

  // Send back hashed text and picture
  return bcrypt.hashAsync(text, config.encrypt.bcryptSaltRounds).then((hash) => {
    return {
      hash,
      picture: picture.toString('base64'),
    }
  });
}

function verify(captcha, hash) {
  // Verify user response against original hash
  return bcrypt.compareAsync(captcha, hash).then((valid) => {
    if (valid) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Promise.OperationalError('Incorrect captcha response!'));
    }
  });
}

module.exports = {
  get,
  verify,
};
