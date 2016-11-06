const Promise = require('bluebird');

const credentialModel = require('../models/credential');
const postModel = require('../models/post');
const profileModel = require('../models/profile');

function create(req, res, next) {
  const { nickname } = req.body;

  return profileModel.createProfileForCredential(req.user.id, { nickname })
      .then((profile) => credentialModel.updateProfileId(req.user.id, profile.insertId)
          .then(() => profile.insertId))
      .then((profileId) => { res.status(200).send({ profileId }); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

// NOTE: this endpoint probably will only by used by Web, since on mobile
// it's better to load the whole profile in one network round trip.
function getLoggedInUserProfile(req, res, next) {
  // TODO(1): Figure out which columns to select when just loading profile info
  // TODO(2): We should load the whole profile (1 DB access) and cache the result in the server.
  return profileModel.findByCredential(req.user.id, [
    'description',
    'avatar',
    'nickname',
  ]).then((profileInfo) => { res.status(200).send(profileInfo); })
    .error((err) => { next(Object.assign(err, { status: 400 })); })
    .catch(next);
}

function getUserProfile(req, res, next) {
  const profileId = req.params.profileId;

  return profileModel.findById(profileId, [
    'description',
    'avatar',
    'nickname',
  ]).then((profileInfo) => { res.status(200).send(profileInfo); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

function retrievePostsForProfile(req, res, next) {
  const profileId = req.params.profileId;
  const order = req.query.sort || 'time';

  return profileModel.findPostsByProfile(profileId, ['id'], req.skip, req.query.limit, order)
      .then((postsMeta) => Promise.all(postsMeta.map((postMeta) =>
          postModel.findPostWithMedia(postMeta.id, ['title', 'description', 'created_at'])
      )))
      .then((posts) => { res.status(200).send(posts); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

module.exports = {
  create,
  getLoggedInUserProfile,
  getUserProfile,
  retrievePostsForProfile,
};
