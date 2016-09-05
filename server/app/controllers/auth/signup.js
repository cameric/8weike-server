const credentialModel = require('../../models/credential');

function signupWithPhone(req, res, next) {
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

module.exports = {
  phone: signupWithPhone,
};
