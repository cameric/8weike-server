const credentialModel = require('../models/credential');
const profileModel = require('../models/profile');

function create(req, res, next) {
  const { nickname } = req.body;

  profileModel.createProfileForCredential(req.user.id, { nickname }).then((profile) => {
    // Update profile_id field after profile is created
    return credentialModel.updateById(req.user.id, {
      profile_id: profile.insertId,
    })
  }).then(() => { res.status(200).send({ success: true }); })
    .error((err) => { next(Object.assign(err, { status: 400 })); })
    .catch(next);
}

module.exports = {
  create,
};
