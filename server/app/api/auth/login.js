const express = require('express');
const passport = require('passport');
const expressEnforcesSsl = require('express-enforces-ssl');

const authController = require('../../controllers/auth');

/**
 * Routes that deal with sensitive data (e.g. login and registerWithPhone) are required to use SSL --- HTTP
 * requests to these routes will redirect automatically to the correponding HTTPS address.
 */
const forceSsl = expressEnforcesSsl();

const loginRouter = express.Router(); // eslint-disable-line new-cap

loginRouter.post('/phone', forceSsl, passport.authenticate('local'),
    authController.loginWithPhone);
loginRouter.post('/weixin', forceSsl, passport.authenticate('weixin'),
    authController.loginWithWeixin);
loginRouter.post('/weibo', forceSsl, passport.authenticate('weibo'),
    authController.loginWithWeibo);

module.exports = loginRouter;

