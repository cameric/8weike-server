/**
 * This is the top level API router that *assembles* everything.
 * Note that we should only write top-level routings in
 * this file (like `/login`). If you create a new routing module,
 * appending to the end and expose.
 */

const express = require('express');
const expressEnforcesSsl = require('express-enforces-ssl');
const passport = require('passport');
const auth = require('../middlewares/auth');

// All Router modules are imported here
const userRouter = require('./user');

// All controllers are imported here
const authController = require('../controllers/auth');

// this router holds all endpoints of 8Weike app
const appRouter = express.Router(); // eslint-disable-line new-cap

// Top-level APIs
/**
 * Routes that deal with sensitive data (e.g. login and registerWithPhone) are required to use SSL --- HTTP
 * requests to these routes will redirect automatically to the correponding HTTPS address.
 */
const forceSsl = expressEnforcesSsl();

appRouter.post('/registerWithPhone', forceSsl, authController.registerWithPhone);
appRouter.post('/login/general', forceSsl, passport.authenticate('local'),
    authController.loginWithPhone);
appRouter.post('/login/weixin', forceSsl, passport.authenticate('weixin'),
    authController.loginWithWeixin);
appRouter.post('/login/weibo', forceSsl, passport.authenticate('weibo'),
    authController.loginWithWeibo);

appRouter.get('/logout', auth.requiresLogin, authController.logout);

// Test api
appRouter.post('/stub', (req, res) => {
  res.send(JSON.stringify({result: req.body.text}));
});

// User-related APIs
appRouter.use('/user', userRouter);

module.exports = appRouter;
