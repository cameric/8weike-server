// This is the controller for app endpoints about user accounts

function loginGeneral(req, res) {
  if (!req.user) return res.redirect('/login');
  return res.redirect(`/users/${req.user.id}`);
}

function loginWeixin(req, res) {
}

function loginWeibo(req, res) {
}

function signup(req, res) {
}

function logout(req, res) {
}

module.exports = {
  loginGeneral,
  loginWeixin,
  loginWeibo,
  signup,
  logout,
};
