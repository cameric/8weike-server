const credentialModel = require('../models/credential');
const profileModel = require('../models/profile');

function create(req, res, next) {
  const { nickname } = req.body;

  return profileModel.createProfileForCredential(req.user.id, { nickname })
      .then((profile) => {
        return credentialModel.updateProfileId(req.user.id, profile.insertId)
            .then(() => profile.insertId);
      })
      .then((profileId) => { res.status(200).send({ profileId }); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

module.exports = {
  create,
};
