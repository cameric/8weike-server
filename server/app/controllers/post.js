const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const config = require('../config/config');
const profileModel = require('../models/profile');
const postModel = require('../models/post');
const uploader = require('../services/upload');
const utils = require('../services/utils');

const readFile = Promise.promisify(fs.readFile);

function create(req, res, next) {
  const postData = req.body;
  const mediaData = req.files;
  // TODO(tony): find a better way to organize the bucket names
  const mediaBucket = '8weike-media';

  // Construct a media file name with the following standard:
  //
  //    profile_id/post_id/hash/original_name.ext
  //
  // This standard will make sure that given one S3 bucket, it's easy
  // to index media files and avoid duplicated keys as much as possible.
  const constructPostMediaName = (post, mediaMeta) => {
    // Note(tony): the media field comes from the filename defind in
    // `api/post`. We need to have a more systematic way to make sure that the
    // two names are consistent.
    const originalName = mediaMeta.media.originalname;
    const fileHash = utils.generateHashWithDate();
    return `${post.profile_id}/${post.id}/${fileHash}/${originalName}`;
  };

  const uploadMedia = (post, media) => {
    // Get path to the temporarily uploaded file
    const tmpFilePath = path.join(config.upload.diskLocation, media.filename);
    return readFile(tmpFilePath, media.encoding)
        .then((file) =>
            uploader.uploadToS3(mediaBucket, constructPostMediaName(post, media), file));
  };

  return profileModel.findByCredential(req.user.id, ['profile_id'])
      .then((profile) => postModel.createPostForProfile(profile.profile_id, postData))
      .then((post) => Promise.all(mediaData.map(uploadMedia.bind(post))))
      .then((postId) => {
        res.status(200).send(postId);
      })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

module.exports = {
  create,
};
