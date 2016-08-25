// This is the controller for app endpoints about user accounts

const registerWithPhone = require('../models/user').registerWithPhone;

function loginWithPhone(req, res) {
  if (!req.user) return res.redirect('/login');
  return res.redirect(`/user/${req.user.id}`);
}

function loginWithWeixin(req, res) {
}

function loginWithWeibo(req, res) {
}

function signupWithPhone(req, res, next) {
  const { phone, password } = req.body;
  registerWithPhone(phone, password)
    .then((data) => { res.status(200).send({ data }); })
    .catch(next);
}

function logout(req, res) {
}

module.exports = {
  loginWithPhone,
  loginWithWeixin,
  loginWithWeibo,
  signupWithPhone,
  logout,
};
