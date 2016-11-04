const profileModel = require('../models/profile');
const postModel = require('../models/post');
const uploader = require('../services/upload');

function create(req, res, next) {
  const postData = req.body;
  const mediaData = req.files;

  return profileModel.findByCredential(req.user.id, ['profile_id'])
      .then((profile) => postModel.createPostForProfile(profile.profile_id, postData))
      .then((post) => {
        res.status(200).send(post.insert_id);
      })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

module.exports = {
  create,
};
