// This router contains all routes after /profile

const express = require('express');
const paginate = require('express-paginate');

const auth = require('../middlewares/auth');
const profile = require('../controllers/profile');

const profileRouter = express.Router(); // eslint-disable-line new-cap

profileRouter.post('/', auth.requiresLogin, profile.create);
profileRouter.get('/me', auth.requiresLogin, profile.getLoggedInUserProfile);
profileRouter.get('/:profileId', profile.getUserProfile);
profileRouter.get('/:profileId/posts', paginate.middleware(), profile.retrievePostsForProfile);

module.exports = profileRouter;
