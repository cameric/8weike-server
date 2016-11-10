const express = require('express');
const media = require('../controllers/media');

const mediaRouter = express.Router(); // eslint-disable-line new-cap

// TODO(tony): make this an internal endpoint somehow
// Note: this endpoint is only for update for media metadata
// and (currently) shouldn't be called by users
mediaRouter.put('/:mediaId', media.updateMedia);

module.exports = mediaRouter;
