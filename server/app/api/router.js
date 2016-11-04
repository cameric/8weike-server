/**
 * This is the top level API router that *assembles* everything.
 * Note that we should only write top-level routings in
 * this file (like `/global_info`). If you create a new routing module,
 * appending to the end and expose.
 */

const express = require('express');
const auth = require('../middlewares/auth');

// All Router modules are imported here
const captchaRouter = require('./auth/captcha');
const localeRouter = require('./locale');
const loginRouter = require('./auth/login');
const profileRouter = require('./profile');
const postRouter = require('./post');
const signupRouter = require('./auth/signup');

// All controllers are imported here
const logout = require('../controllers/auth').logout;

// this router holds all endpoints of 8Weike app
const appRouter = express.Router(); // eslint-disable-line new-cap

// Api for showing global information about the company
appRouter.get('/global_info', (req, res) => {
  res.status(200).send({
    version: 'Alpha',
    company: 'Cameric',
  });
});

// Authentication-related APIs
appRouter.use('/signup', signupRouter);
appRouter.use('/login', loginRouter);
appRouter.get('/logout', auth.requiresLogin, logout);
appRouter.use('/captcha', captchaRouter);

// Profile-related APIs
appRouter.use('/profile', profileRouter);

// Post-related APIS
appRouter.use('/post', postRouter);

// Locale-related APIs
appRouter.use('/locale', localeRouter);

module.exports = appRouter;
