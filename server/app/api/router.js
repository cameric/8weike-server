/**
 * This is the top level API router that *assembles* everything.
 * Note that we should only write top-level routings in
 * this file (like `/login`). If you create a new routing module,
 * appending to the end and expose.
 */

const express = require('express');
const passport = require('passport');
const auth = require('../middlewares/auth');

// All Router modules are imported here
const usersRouter = require('./users');

// All controllers are imported here
const authController = require('../controllers/auth');

// this router holds all endpoints of 8Weike app
const appRouter = express.Router(); // eslint-disable-line new-cap

// Top-level APIs
appRouter.post('/signup', authController.signup);
appRouter.post('/login/general', passport.authenticate('local'), authController.generalLogin);
appRouter.post('/login/weixin', passport.authenticate('weixin'), authController.weixinLogin);
appRouter.post('/login/weibo', passport.authenticate('weibo'), authController.weiboLogin);
appRouter.get('/logout', auth.requiresLogin, authController.logout);

// User-related APIs
appRouter.use('/users', usersRouter);

module.exports = appRouter;
