// Utility functions for sending SMS message

const Promise = require('bluebird');

const request = Promise.promisifyAll(require('request'));
const config = require('../config/config');

/**
 * Send a SMS message to a user's cellphone using Yun Pian
 * @param phone {string} the cellphone number to be registered
 * @param content {object} the cellphone number to be registered
 * @param tplId {int} the code to be sent to user
 * @return {Promise.<TResult>} Whether the code is sent successfully
 */
function send(phone, content, tplId=1) {
  return request.postAsync(`${config.sms.url}/sms/tpl_send.json`, {
    apikey: config.sms.apiKey,
    mobile: phone,
    tpl_id: tplId,
    tpl_value: JSON.stringify(content),
  }).then((res) => {
    if (!res.result.count) {
      return Promise.reject(
        new Promise.OperationalError('Error sending SMS message.')
      );
    }
    return Promise.resolve();
  });
}

module.exports = {
  send,
};
