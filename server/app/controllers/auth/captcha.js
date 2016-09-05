// Create and send captcha using ccap
// Note(tonyzhang): the reason that we could not use reCaptcha is that it's a
// Google service. Whenever the service is available in mainland China,
// We chould switch to it.

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const ccap = require('ccap');

const config = require('../../config/config');

function get(req, res, next) {
  const [ text, picture ] = ccap(req.body).get();

  // Send back hashed text and picture
  bcrypt.hashAsync(text, config.encrypt.bcryptSaltRounds).then((hash) => {
    return {
      hash,
      // picture: new Buffer(String.fromCharCode(...new Uint8Array(picture))).toString('base64'),
      picture: picture.toString('base64'),
    }
  }).then((data) => {
    res.status(200).send(data);
  }).catch(next);
}

function verify(req, res, next) {
  const { captcha, hash } = req.body;

  // Verify user response against original hash
  bcrypt.compareAsync(captcha, hash).then((valid) => {
    if (valid) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Promise.OperationalError('Incorrect captcha response!'));
    }
  }).then(() => {
    res.status(200).send({ success: true });
  }).error((err) => {
    const errWithStatus = err;
    errWithStatus.status = 400;
    next(errWithStatus);
  }).catch(next);
}

module.exports = {
  get,
  verify,
};
