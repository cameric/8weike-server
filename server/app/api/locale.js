// This router contains all routes after /locale

const express = require('express');

const locale = require('../controllers/locale');

const localeRouter = express.Router(); // eslint-disable-line new-cap

localeRouter.get('/', locale.get);
localeRouter.post('/', locale.set);

module.exports = localeRouter;
