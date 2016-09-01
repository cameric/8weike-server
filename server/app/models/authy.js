// Utility functions for TFA using Authy server and API

const Promise = require('bluebird');

const config = require('../config/config');
const authy = Promise.promisifyAll(require('authy')(config.authy.apiKey, config.authy.host));

/**
 * Register a user into the Authy user database for TFA
 * Note that since email field is not necessary and not unique,
 * use a dummy Cameric email instead.
 * @param phone {string} the cellphone number to be registered
 * @return {Promise.<TResult>} the id of the user in the authy db
 */
function registerInAuthy(phone) {
  return authy.register_userAsync(config.authy.email, phone, config.authy.countryCode)
    .then((res) => {
      if (!res.success) {
        return Promise.reject(
          new Promise.OperationalError('Error creating Authy user.')
        );
      }
      return {authyId: res.user.id};
    });
}

/**
 * Send a TFA code to the user's cellphone
 * @param authyId {string} the cellphone number to be registered
 * @return {Promise.<TResult>} Whether the code is sent successfully
 */
function sendCodeWithAuthy(authyId) {
  return authy.request_smsAsync(authyId).then((res) => {
    if (!res.success) {
      return Promise.reject(
        new Promise.OperationalError('Error sending TFA code.')
      );
    }
    return Promise.resolve();
  });
}

/**
 * Register a user into the Authy user database for TFA
 * Note that since email fiedl is not necessary and not unique,
 * use a dummy Cameric email instead.
 * @param authyId {string} the cellphone number to be registered
 * @param otp {string} the TFA code
 * @return {Promise.<TResult>} If success, a status message will be sent.
 */
function verifyWithAuthy(authyId, otp) {
  return authy.verifyAsync(authyId, otp).then((res) => {
    if (!res.success) {
      return Promise.reject(
        new Promise.OperationalError('Error verifying TFA code.')
      );
    }
    return res;
  });
}

module.exports = {
  registerInAuthy,
  sendCodeWithAuthy,
  verifyWithAuthy,
};