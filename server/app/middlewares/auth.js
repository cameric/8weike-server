// This file configures some middlewares for authentication

function requiresLogin(req, res, next) {
  if (!req.isAuthenticated())
    return next(Object.assign({}, new Error('User is not authorized'), { status: 401 }));
  return next();
}

module.exports = {
  requiresLogin,
};
