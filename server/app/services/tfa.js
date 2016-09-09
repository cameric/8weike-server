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
 * Generate a tfa code according to `secret` and send it via SMS to `phone`.
 * @param secret {string}
 * @param phone {string}
 * @return {Promise.<TResult>} Whether the tfa code is sent out successfully
 */
function sendCode(secret, phone) {
  const tfaTemplateId = 1550692;

  return smsService.send(phone, {
    '#code#': generateCode(secret),
  }, tfaTemplateId);
}

/**
 * Verify a provided tfa code given a credential
 * @param credential {Object}
 * @param code {string} the user-inputed TFA value.
 * @return {Promise.<TResult>} Whether the user put in the correct TFA value.
 */
function verifyCode(secret, code) {
  const isCodeCorrect = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: code,
  });

  if (!isCodeCorrect) return Promise.reject(new Promise.OperationalError('Code is incorrect!'));
  return Promise.resolve();
}

module.exports = {
  sendCode,
  verifyCode,
  generateCode, // For testing purpose
};
