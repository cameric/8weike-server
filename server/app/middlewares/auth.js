// This file configures some middlewares for authentication

function requiresLogin(req, res, next) {
  if (!req.isAuthenticated())
    return res.status(401).send({
      statusCode: 401,
      message: 'User is not authorized',
    });
  return next();
}

module.exports = {
  requiresLogin,
};
