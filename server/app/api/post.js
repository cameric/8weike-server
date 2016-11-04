// This router contains all routes after /post

const express = require('express');
const upload = require('multer')();

const auth = require('../middlewares/auth');
const config = require('../config/config');
const post = require('../controllers/post');

const postRouter = express.Router(); // eslint-disable-line new-cap
const handleUpload = upload.array('media', config.post.maxCount);

postRouter.post('/', auth.requiresLogin, handleUpload, post.create);

module.exports = postRouter;
