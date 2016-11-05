// Utility functions for sending SMS message

const Promise = require('bluebird');
const request = require('request-promise');

const config = require('../config/config');

/**
 * Send a SMS message to a user's cellphone using Yun Pian
 * @param phone {string} the cellphone number to be registered
 * @param content {object} the cellphone number to be registered
 * @param tplId {int} the SMS template ID to use for sending message
 * @return {Promise.<TResult>} Whether the code is sent successfully
 */
function send(phone, content, tplId=1) {
  // Only send sms in production environment to avoid cost
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Message content is: ${JSON.stringify(content)}`);
    return Promise.resolve();
  }

  const options = {
    method: 'POST',
    uri: `${config.sms.url}/sms/tpl_send.json`,
    headers: {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    form: {
      apikey: config.sms.apiKey,
      mobile: phone,
      tpl_id: tplId,
      tpl_value: content,
    },
  };

  return request(options).then((res) => {
    if (res.code > 0) {
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
