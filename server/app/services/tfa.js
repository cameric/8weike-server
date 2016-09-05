const speakeasy = require('speakeasy');
const Promise = require('bluebird');

const credentialModel = require('../models/credential');
const smsService = require('./sms');

function sendCode(uid) {
  return credentialModel.findById(uid, ['phone', 'tfa_secret']).then((credential) => {
    // Send TFA code
    return smsService.send(credential.phone, {
      '#code#': generateCode(credential.tfa_secret),
    })
  });
}

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
