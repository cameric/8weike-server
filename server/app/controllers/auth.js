// This is the controller for app endpoints about user accounts

function loginWithPhone(req, res) {
  if (!req.user) return res.redirect('/login');
  return res.redirect(`/user/${req.user.id}`);
}

function loginWithWeixin(req, res) {
}

function loginWithWeibo(req, res) {
}

function signupWithPhone(req, res) {
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
