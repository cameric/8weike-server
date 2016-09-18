const login = require('./login');
const signup = require('./signup');

function logout(req, res) {
  req.logout();
  res.status(200).send();
}

module.exports = {
  logout,
  login,
  signup,
};
