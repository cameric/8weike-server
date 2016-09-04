const speakeasy = require('speakeasy');
const Promise = require('bluebird');

const credentialModel = require('../../models/credential');
const smsService = require('../../services/sms');

function getCode(req, res, next) {
  const uid = req.body.uid;

  credentialModel.findById(uid, ['phone', 'tfa_secret']).then((credential) => {
    // Send TFA code
    return smsService.sendSmsMessage(credential.phone, {
      '#code#': generateTfaCode(credential.tfa_secret),
    })
  }).then(() => {
    res.status(200).send({ success: true });
  }).error((err) => {
    const errWithStatus = err;
    errWithStatus.status = 400;
    next(errWithStatus);
  }).catch(next);
}

function verifyCode(req, res, next) {
  const { uid, code } = req.body;

  const matchCodePromise = credentialModel.findById(uid, ['tfa_secret']).then((credential) => {
    if (code !== generateTfaCode(credential.tfa_secret)) {
      return Promise.reject(new Promise.OperationalError('Code is incorrect!'));
    } else {
      return Promise.resolve();
    }
  });

  // Update is_verified field if verified code successfully
  matchCodePromise.then(() => {
    return credentialModel.updateById(uid, { is_verified: true });
  }).then(() => {
    res.status(200).send({ success: true });
  }).error((err) => {
    const errWithStatus = err;
    errWithStatus.status = 400;
    next(errWithStatus);
  }).catch(next);
}

function generateTfaCode(secret) {
  return speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });
}

module.exports = {
  getCode,
  verifyCode,
  generateTfaCode, // For testing purpose
};
