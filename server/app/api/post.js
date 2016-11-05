// This router contains all routes after /post

const express = require('express');
const multer = require('multer');
const path = require('path');

const auth = require('../middlewares/auth');
const config = require('../config/config');
const post = require('../controllers/post');
const utils = require('../services/utils');

// Construct disk storage for storing uploaded media files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.diskLocation);
  },
  filename: (req, file, cb) => {
    const parsedName = path.parse(file.originalname);
    const fileHash = utils.generateHashWithDate();
    const tmpFileName = `tmp.post-${parsedName.name}-${fileHash}${parsedName.ext}`;
    cb(null, tmpFileName);
  },
});
const upload = multer({ storage });

const postRouter = express.Router(); // eslint-disable-line new-cap
// TODO(tony): Find a better place to set the max count of files in a post
const handleUpload = upload.array('media', 10);

postRouter.post('/', auth.requiresLogin, handleUpload, post.create);

module.exports = postRouter;
