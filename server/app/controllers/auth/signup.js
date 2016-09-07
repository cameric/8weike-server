const Promise = require('bluebird');

const credentialModel = require('../../models/credential');
const tfaService = require('../../services/tfa');
const captchaService = require('../../services/captcha');

// Note(tony): have two versions of signup endpoints because
// Mobile devices do not need captcha verification
function signupWithPhone(req, res, next, needsCaptcha) {
  const { phone, password, captcha, hash } = req.body;

  const verifyCaptcha = needsCaptcha ? captchaService.verify(captcha, hash) : Promise.resolve();
  verifyCaptcha.then(() => {
    // Record credential data in DB
    return credentialModel.signupWithPhone(phone, password);
  }).then((credential) => {
    // Send TFA code based on the id of the newly created credential
    return tfaService.sendCode(credential.insertId);
  }).then(() => {
    res.status(200).send({ success: true });
  }).error((err) => {
    let errMsg = null;
    if (err.code === 'ER_DUP_ENTRY') {
      errMsg = 'User already exists!';
    }
    const error = errMsg ? new Error(errMsg) : err;
    next(Object.assign(error, { status: 400 }));
  }).catch(next);
}

function signupWithPhoneNoCaptcha(req, res, next) {
  signupWithPhone(req, res, next, false);
}

function signupWithPhoneWithCaptcha(req, res, next) {
  signupWithPhone(req, res, next, true);
}

function verify(req, res, next) {
  const { credential, code } = req.body;

  tfaService.verifyCode(credential.id, code).then(() => {
    // Update is_verified field if verified code successfully
    return credentialModel.updateById(credential.id, { is_verified: true });
  }).then(() => {
    // Automatically login after user credential is verified
    req.login(credential, (err) => {
      if (err) return Promise.reject(new Promise.OperationalError('Automatic login failed!'));
      return Promise.resolve();
    });
  }).then((data) => { res.status(200).send({ data }); })
    .error((err) => { next(Object.assign(err, { status: 400 })); })
    .catch(next);
}

module.exports = {
  phoneNoCaptcha: signupWithPhoneNoCaptcha,
  phoneWithCaptcha: signupWithPhoneWithCaptcha,
  verify,
};
