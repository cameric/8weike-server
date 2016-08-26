const userModel = require('../../models/user');

function signupWithPhone(req, res, next) {
  const { phone, password } = req.body;
  userModel.signupWithPhone(phone, password)
      .then((data) => { res.status(200).send({ data }); })
      // TODO: We probably need to respond with some data about the cause of recoverable errors, but
      // we also shouldn't just return the error itself --- that's a security risk.
      .error((_) => { res.status(400).send(); })
      .catch(next);
}

module.exports = {
  phone: signupWithPhone,
};
