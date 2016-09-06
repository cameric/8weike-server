const credentialModel = require('../models/credential');
const profileModel = require('../models/profile');

function create(req, res, next) {
  const { nickname } = req.body;

  profileModel.createProfileWithName(req.user, nickname).then((profile) => {
    // Update profile_id field after profile is created
    return credentialModel.updateById(req.user, {
      profile_id: profile.insertId,
    })
  }).then(() => {
    res.status(200).send({ success: true });
  }).error((err) => {
    const errWithStatus = err;
    errWithStatus.status = 400;
    next(errWithStatus);
  }).catch(next);
}

module.exports = {
  create,
};
