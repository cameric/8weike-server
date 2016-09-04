const express = require('express');
const expressEnforcesSsl = require('express-enforces-ssl');

const tfa = require('../../controllers/auth/tfa');

/**
 * Routes that deal with sensitive data (e.g. login and registerWithPhone) are required to use SSL.
 * HTTP requests to these routes will redirect automatically to the correponding HTTPS address.
 */
const forceSsl = expressEnforcesSsl();

const tfaRouter = express.Router(); // eslint-disable-line new-cap

// TODO: Uncomment this line once we have HTTPS working
// tfaRouter.post('/send', forceSsl, tfa.getCode);
tfaRouter.post('/send', tfa.sendCode);
// tfaRouter.post('/verify', forceSsl, tfa.verify);
tfaRouter.post('/verify', tfa.verifyCode);

module.exports = tfaRouter;
