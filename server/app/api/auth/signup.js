const express = require('express');
const expressEnforcesSsl = require('express-enforces-ssl');

const signup = require('../../controllers/auth').signup;

/**
 * Routes that deal with sensitive data (e.g. login and registerWithPhone) are required to use SSL.
 * HTTP requests to these routes will redirect automatically to the correponding HTTPS address.
 */
const forceSsl = expressEnforcesSsl();

const signupRouter = express.Router(); // eslint-disable-line new-cap

// TODO: Force SSL once we have HTTPS working
signupRouter.post('/phone/mobile', signup.withoutCaptcha.phone);
signupRouter.post('/phone/web', signup.withCaptcha.phone);
signupRouter.post('/verify', signup.verify);
signupRouter.post('/resend_code', signup.resendCode);

module.exports = signupRouter;
