// This is the controller for app endpoints about user accounts

function generalLogin(req, res) {
  if (!req.user) return res.redirect('/login');
  else return res.redirect(`/users/${req.user.id}`);
}

function weixinLogin(req, res) {
}

function weiboLogin(req, res) {
}

function signup(req, res) {
}

function logout(req, res) {
}

module.exports = {
  generalLogin,
  weixinLogin,
  weiboLogin,
  signup,
  logout,
};
