// This router contains all routes after /user

const express = require('express');
const profile = require('../controllers/profile');
const auth = require('../middlewares/auth');

const profileRouter = express.Router(); // eslint-disable-line new-cap

profileRouter.post('/create', auth.requiresLogin, profile.create);

module.exports = profileRouter;
