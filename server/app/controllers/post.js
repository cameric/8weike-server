const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const config = require('../config/config');
const mediaModel = require('../models/media');
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
  //    profile_id/post_id/hash-original_name.ext
  //
  // This standard will make sure that given one S3 bucket, it's easy
  // to index media files and avoid duplicated keys as much as possible.
  const constructPostMediaName = (post, mediaMeta) => {
    // Note(tony): the media field comes from the filename defind in
    // `api/post`. We need to have a more systematic way to make sure that the
    // two names are consistent.
    const originalName = mediaMeta.originalname;
    const fileHash = utils.generateHashWithDate();
    return `${post.profile_id}/${post.id}/${fileHash}-${originalName}`;
  };

  const uploadMedia = (post, media) => {
    // Get path to the temporarily uploaded file
    const originalBasename = path.parse(media.originalname).name;
    const tmpFilePath = path.join(config.upload.diskLocation, media.filename);

    // Construct S3 object name, upload to S3, build media metadata and its
    // relation with the post object, and finally remove the temporary file.
    return readFile(tmpFilePath)
        .then((file) => uploader.uploadToS3(mediaBucket,
            constructPostMediaName(post, media), file))
        .then((s3Record) => mediaModel.createMediaResource(originalBasename,
            s3Record.Key, s3Record.Location))
        .then((packet) => postModel.addMediaToPost(post.id, packet.insertId))
        .then((_) => uploader.removeTemporary(media.filename));
  };

  let postId = null;
  return profileModel.findByCredential(req.user.id, ['id'])
      .then((profile) => postModel.createPostForProfile(profile.id, postData))
      .then((packet) => postModel.findById(packet.insertId, ['id', 'profile_id']))
      .then((post) => {
        postId = post.id; // Save the post ID for sending response
        return Promise.all(mediaData.map(uploadMedia.bind(this, post)));
      })
      .then((_) => {
        res.status(200).send({ id: postId });
      })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

function getPostById(req, res, next) {
  const postId = req.params.postId;

  return postModel.findPostWithMedia(postId, ['title', 'description', 'created_at'])
      .then((post) => { res.status(200).send(post); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

module.exports = {
  create,
  getPostById,
};
