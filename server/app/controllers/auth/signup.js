const Promise = require('bluebird');

const credentialModel = require('../../models/credential');
const tfaService = require('../../services/tfa');
const captchaService = require('../../services/captcha');

// Note(tony): have two versions of signup endpoints because
// Mobile devices do not need captcha verification
function signupWithPhone(req, res, next, needsCaptcha) {
  const { phone, password } = req.body;
  const captcha = req.body.captcha ? req.body.captcha : null;
  const hash = req.body.hash ? req.body.hash : null;

  const verifyCaptcha = needsCaptcha ? captchaService.verify(captcha, hash) : Promise.resolve();
  verifyCaptcha.then(() => {
    return credentialModel.signupWithPhone(phone, password);
  }).then((credential) => { res.status(200).send({ uid: credential.insertId }); })
    .error((err) => {
      let errMsg = null;
      if (err.code === 'ER_DUP_ENTRY') {
        errMsg = 'User already exists!';
      }
      const errWithStatus = errMsg ? new Error(errMsg) : err;
      errWithStatus.status = 400;
      next(errWithStatus);
    })
    .catch(next);
}

function signupWithPhoneNoCaptcha(req, res, next) {
  signupWithPhone(req, res, next, false);
}

function signupWithPhoneWithCaptcha(req, res, next) {
  signupWithPhone(req, res, next, true);
}

function verify(req, res, next) {
  const { user, code } = req.body;

  tfaService.verifyCode(user.id, code).then(() => {
    // Update is_verified field if verified code successfully
    return credentialModel.updateById(user.id, { is_verified: true });
  }).then(() => {
    // Automatically login after user credential is verified
    req.login(user, (err) => {
      if (err) {
        return Promise.reject(new Promise.OperationalError('Automatic login failed!'));
      }
      return Promise.resolve();
    });
  }).then((data) => { res.status(200).send({ data }); })
    .error((err) => {
      const errWithStatus = err;
      errWithStatus.status = 400;
      next(errWithStatus);
    })
    .catch(next);
}

module.exports = {
  phoneNoCaptcha: signupWithPhoneNoCaptcha,
  phoneWithCaptcha: signupWithPhoneWithCaptcha,
  verify,
};
