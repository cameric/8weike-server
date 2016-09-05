const express = require('express');
const expressEnforcesSsl = require('express-enforces-ssl');

const signup = require('../../controllers/auth').signup;

/**
 * Routes that deal with sensitive data (e.g. login and registerWithPhone) are required to use SSL.
 * HTTP requests to these routes will redirect automatically to the correponding HTTPS address.
 */
const forceSsl = expressEnforcesSsl();

const signupRouter = express.Router(); // eslint-disable-line new-cap

// TODO: Uncomment this line once we have HTTPS working
// signupRouter.post('/phone/mobile', forceSsl, signup.phoneOnMobile);
signupRouter.post('/phone/mobile', signup.phoneNoCaptcha);
// signupRouter.post('/phone/web', forceSsl, signup.phoneOnWeb);
signupRouter.post('/phone/web', signup.phoneWithCaptcha);
signupRouter.post('/verify', signup.verify);

module.exports = signupRouter;
