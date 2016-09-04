const credentialModel = require('../../models/credential');

function signupWithPhone(req, res, next) {
  const { phone, password } = req.body;
  credentialModel.signupWithPhone(phone, password)
    .then((data) => { res.status(200).send({ data }); })
    .error((err) => {
      const errWithStatus = err;
      errWithStatus.status = 400;
      next(errWithStatus);
    })
    .catch(next);
}

module.exports = {
  phone: signupWithPhone,
};
