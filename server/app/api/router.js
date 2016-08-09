'use strict';

/**
 * This is the top level API router that *assembles* everything.
 * Note that we should only write top-level routings in
 * this file (like `/login`). If you create a new routing module,
 * appending to the end and expose.
 */

const express = require('express'),
      passport = require('passport'),
      auth = require('../middlewares/auth');

// All Router modules are imported here
const UsersRouter = require('./users');

// All controllers are imported here
const AuthController = require('../controllers/auth');

// this router holds all endpoints of 8Weike app
let AppRouter = express.Router();

/* Top-level APIs */
AppRouter.post('/signup', AuthController.signup);
AppRouter.post('/login/general', passport.authenticate('local'), AuthController.generalLogin);
AppRouter.post('/login/weixin', passport.authenticate('weixin'), AuthController.weixinLogin);
AppRouter.post('/login/weibo', passport.authenticate('weibo'), AuthController.weiboLogin);
AppRouter.get('/logout', auth.requiresLogin, AuthController.logout);

/* User-related APIs */
AppRouter.use('/users', UsersRouter);

module.exports = AppRouter;