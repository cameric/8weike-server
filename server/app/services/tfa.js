const Promise = require('bluebird');
const speakeasy = require('speakeasy');

const smsService = require('./sms');

/**
 * Generate a TFA code using a secret
 * @param secret {string} the secret to be fed into speakeasy.
 * @return {object} The result tfa code
 */
function generateCode(secret) {
  return speakeasy.totp({
    secret,
    encoding: 'base32',
  });
}

/**
 * Generate a tfa code according to the given credential and send out using SMS.
 * @param credential {Object}
 * @return {Promise.<TResult>} Whether the tfa code is sent out successfully
 */
function sendCode(credential) {
  const tfaTemplateId = 1550692;

  return smsService.send(credential.phone, {
    '#code#': generateCode(credential.tfa_secret),
  }, tfaTemplateId);
}

/**
 * Verify a provided tfa code given a user id
 * @param credential {Object}
 * @param code {string} the user-inputed TFA value.
 * @return {Promise.<TResult>} Whether the user put in the correct TFA value.
 */
function verifyCode(credential, code) {
  // Verify the given 6-digit code
  try {
    const isCodeCorrect = speakeasy.totp.verify({
      secret: credential.tfa_secret,
      encoding: 'base32',
      token: code,
    });

    if (!isCodeCorrect) return Promise.reject(new Promise.OperationalError('Code is incorrect!'));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  sendCode,
  verifyCode,
  generateCode, // For testing purpose
};
