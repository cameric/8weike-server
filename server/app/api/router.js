/**
 * This is the top level API router that *assembles* everything.
 * Note that we should only write top-level routings in
 * this file (like `/global_info`). If you create a new routing module,
 * appending to the end and expose.
 */

const express = require('express');
const auth = require('../middlewares/auth');

// All Router modules are imported here
const signupRouter = require('./auth/signup');
const loginRouter = require('./auth/login');
const userRouter = require('./user');

// All controllers are imported here
const authController = require('../controllers/auth');

// this router holds all endpoints of 8Weike app
const appRouter = express.Router(); // eslint-disable-line new-cap

// Top-level APIs
appRouter.get('/logout', auth.requiresLogin, authController.logout);

// Api for showing global information about the company
appRouter.get('/global_info', (req, res) => {
  res.send(JSON.stringify({
    version: 'Alpha',
    company: 'Cameric',
  }));
});

// Authentication-related APIs
appRouter.use('/signup', signupRouter);
appRouter.use('/login', loginRouter);

// User-related APIs
appRouter.use('/user', userRouter);

module.exports = appRouter;
