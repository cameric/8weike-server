const speakeasy = require('speakeasy');
const Promise = require('bluebird');

const credentialModel = require('../models/credential');
const smsService = require('./sms');

/**
 * Generate a tfa code according to the user's uid and send out using SMS.
 * @param uid {string} the uid of the user that will generate TFA from.
 * @return {Promise.<TResult>} Whether the tfa code is sent out successfully
 */
function sendCode(uid) {
  return credentialModel.findById(uid, ['phone', 'tfa_secret']).then((credential) => {
    // Send TFA code
    return smsService.send(credential.phone, {
      '#code#': generateCode(credential.tfa_secret),
    })
  });
}

/**
 * Verify a provided tfa code given a user id
 * @param uid {string} the uid of the user that will be verified.
 * @param code {string} the user-inputed TFA value.
 * @return {Promise.<TResult>} Whether the user put in the correct TFA value.
 */
function verifyCode(uid, code) {
  return credentialModel.findById(uid, ['tfa_secret']).then((credential) => {
    // Verify the given 6-digit code
    const isCodeCorrent = speakeasy.totp.verify({
      secret: credential.tfa_secret,
      encoding: 'base32',
      token: code,
    });

    if (!isCodeCorrent) {
      return Promise.reject(new Promise.OperationalError('Code is incorrect!'));
    } else {
      return Promise.resolve();
    }
  });
}

/**
 * Generate a TFA code using a secret
 * @param secret {string} the secret to be fed into speakeasy.
 * @return {object} The result tfa code
 */
function generateCode(secret) {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32',
  });
}

module.exports = {
  sendCode,
  verifyCode,
  generateCode, // For testing purpose
};
