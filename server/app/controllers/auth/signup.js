const Promise = require('bluebird');

const credentialModel = require('../../models/credential');
const tfaService = require('../../services/tfa');
const captchaService = require('../../services/captcha');

function sendCode(pendingCredential) {
  return tfaService.sendCode(pendingCredential.tfa_secret, pendingCredential.phone);
}

function resendCode(req, res, next) {
  const pendingCredential = req.session.pendingCredential;

  if (!pendingCredential) {
    const err = new Promise.OperationalError('User is not pending signup.');
    return next(Object.assign(err, { status: 400 }));
  }

  // TODO: Later on, we may want to consider adding a progressively-lengthening delay after the SMS
  // is resent a certain number of times, to prevent spam. However, this requires some cache
  // infrastructure to record which phone numbers we have sent SMSes to recently.
  return sendCode(pendingCredential)
      .then(() => { res.status(200).send(); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

function saveSignupDataToSession(session, phone, password) {
  const verifyNotAlreadySignedUp = () => credentialModel.findByPhoneNumber(phone, ['id'])
      .then(() => Promise.reject(new Promise.OperationalError('Credential already exists!')),
            () => Promise.resolve());

  const saveSession = Promise.promisify(session.save, { context: session });
  const savePendingCredentialToSession = () => credentialModel.createTemporary(phone, password)
      .then((credential) => {
        session.pendingCredential = credential; // eslint-disable-line no-param-reassign
      })
      .then(() => saveSession);

  return verifyNotAlreadySignedUp()
      .then(() => savePendingCredentialToSession());
}

// TODO: This is unfixably spam-enabling in a variety of ways. We need captcha for all signup EPs,
// since they can be used to send SMS.
function signupWithPhoneWithoutCaptcha(req, res, next) {
  const { phone, password } = req.body;
  const session = req.session;

  saveSignupDataToSession(session, phone, password)
      .then(() => sendCode(session.pendingCredential))
      .then(() => { res.status(200).send(); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

function signupWithPhoneWithCaptcha(req, res, next) {
  const { phone, password, captcha, hash } = req.body;
  const session = req.session;

  captchaService.verify(captcha, hash)
      .then(() => saveSignupDataToSession(session, phone, password))
      .then(() => sendCode(session.pendingCredential))
      .then(() => { res.status(200).send(); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

function verify(req, res, next) {
  const { code } = req.body;
  const session = req.session;

  const pendingCredential = session.pendingCredential;
  if (!pendingCredential) {
    const err = new Promise.OperationalError('User is not pending signup.');
    next(Object.assign(err, { status: 400 }));
    return;
  }

  tfaService.verifyCode(pendingCredential.tfa_secret, code)
      .then(() => credentialModel.saveToDatabase(req.session.pendingCredential))
      .then((newCredentialEntry) => {
        // Automatically login after the credential is created
        const login = Promise.promisify(req.login, { context: req });
        const newCredentialId = newCredentialEntry.insertId;
        return login({ id: newCredentialId }).then(() => newCredentialId);
      })
      .then((id) => {
        res.status(200).send({ id });

        // Remove the pending credential data from the session -- it is not needed anymore
        delete session.pendingCredential;
      })
    .error((err) => { next(Object.assign(err, { status: 400 })); })
    .catch(next);
}

module.exports = {
  withoutCaptcha: {
    phone: signupWithPhoneWithoutCaptcha,
  },
  withCaptcha: {
    phone: signupWithPhoneWithCaptcha,
  },
  resendCode,
  verify,
};
