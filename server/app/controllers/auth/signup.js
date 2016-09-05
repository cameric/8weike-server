const credentialModel = require('../../models/credential');
const tfaService = require('../../services/tfa');
const captchaService = require('../../services/captcha');

// Note(tony): have two versions of signup endpoints because
// Mobile devices do not need captcha verification
function signupWithPhoneOnMobile(req, res, next) {
  const { phone, password } = req.body;
  credentialModel.signupWithPhone(phone, password)
    .then((data) => { res.status(200).send({ data }); })
    .error((err) => {
      let errMsg = '';
      if (err.code === 'ER_DUP_ENTRY') {
        errMsg = 'User already exists!';
      } else {
        errMsg = 'An error occurred during signup!';
      }
      const errWithStatus = new Error(errMsg);
      errWithStatus.status = 400;
      next(errWithStatus);
    })
    .catch(next);
}

function signupWithPhoneOnWeb(req, res, next) {
  const { phone, password, captcha, hash } = req.body;

  captchaService.verify(captcha, hash).then(() => {
    return credentialModel.signupWithPhone(phone, password);
  }).then((data) => { res.status(200).send({ data }); })
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

function verifyWithTFA(req, res, next) {
  const { uid, code } = req.body;

  tfaService.verifyCode(uid, code).then(() => {
    // Update is_verified field if verified code successfully
    return credentialModel.updateById(uid, { is_verified: true });
  }).then((data) => { res.status(200).send({ data }); })
    .error((err) => {
      const errWithStatus = err;
      errWithStatus.status = 400;
      next(errWithStatus);
    })
    .catch(next);
}

module.exports = {
  phoneOnMobile: signupWithPhoneOnMobile,
  phoneOnWeb: signupWithPhoneOnWeb,
  verify: verifyWithTFA,
};
