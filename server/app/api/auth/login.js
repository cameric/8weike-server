const express = require('express');
const passport = require('passport');
const expressEnforcesSsl = require('express-enforces-ssl');

const login = require('../../controllers/auth').login;

/**
 * Routes that deal with sensitive data (e.g. login and registerWithPhone) are required to use SSL.
 * HTTP requests to these routes will redirect automatically to the correponding HTTPS address.
 */
const forceSsl = expressEnforcesSsl();

const loginRouter = express.Router(); // eslint-disable-line new-cap

// TODO: Uncomment these lines once we have HTTPS working
// loginRouter.post('/phone', forceSsl, passport.authenticate('local'), login.phone);
// loginRouter.post('/weixin', forceSsl, passport.authenticate('weixin'), login.weixin);
// loginRouter.post('/weibo', forceSsl, passport.authenticate('weibo'), login.weibo);

loginRouter.post('/phone', passport.authenticate('local'), login.phone);
loginRouter.post('/weixin', passport.authenticate('weixin'), login.weixin);
loginRouter.post('/weibo', passport.authenticate('weibo'), login.weibo);

// Check if the user has logged in
loginRouter.get('/', login.checkIfLoggedIn);

module.exports = loginRouter;
