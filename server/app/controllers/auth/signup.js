const Promise = require('bluebird');

const credentialModel = require('../../models/credential');
const tfaService = require('../../services/tfa');
const captchaService = require('../../services/captcha');

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
      .then(() => savePendingCredentialToSession())
      .then(() => tfaService.sendCode(session.pendingCredential.tfa_secret,
          session.pendingCredential.phone));
}

function signupWithPhoneWithoutCaptcha(req, res, next) {
  const { phone, password } = req.body;
  const session = req.session;

  saveSignupDataToSession(session, phone, password)
      .then(() => { res.status(200).send(); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

function signupWithPhoneWithCaptcha(req, res, next) {
  const { phone, password, captcha, hash } = req.body;
  const session = req.session;

  captchaService.verify(captcha, hash)
      .then(() => saveSignupDataToSession(session, phone, password))
      .then(() => { res.status(200).send(); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

function verify(req, res, next) {
  const { code } = req.body;
  const session = req.session;

  tfaService.verifyCode(req.session.pendingCredential.tfa_secret, code)
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
  verify,
};
