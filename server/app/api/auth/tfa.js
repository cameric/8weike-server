const express = require('express');
const tfa = require('../../controllers/auth/tfa');

const tfaRouter = express.Router(); // eslint-disable-line new-cap

tfaRouter.post('/send', tfa.send);

module.exports = tfaRouter;
