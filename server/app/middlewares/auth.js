// This file configures some middlewares for authentication
const Promise = require('bluebird');

function requiresLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    const error = new Promise.OperationalError('User is not authorized');
    return next(Object.assign(error, { status: 401 }));
  }
  return next();
}

module.exports = {
  requiresLogin,
};
