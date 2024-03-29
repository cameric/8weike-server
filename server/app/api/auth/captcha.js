const express = require('express');
const captcha = require('../../controllers/auth/captcha');

const captchaRouter = express.Router(); // eslint-disable-line new-cap

captchaRouter.post('/', captcha.get);

module.exports = captchaRouter;
