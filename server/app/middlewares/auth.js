// This file configures some middlewares for authentication

function requiresLogin(req, res, next) {
  if (!req.isAuthenticated()) return res.send(401, 'User is not authorized');
  return next();
}

module.exports = {
  requiresLogin,
};
