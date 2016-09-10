const credentialModel = require('../../models/credential');

function loginWithPhone(req, res, next) {
  if (!req.user) return next(Object.assign(new Error('req.user is null'), { status: 404 }));

  // Need to have another query because after credential is serialized,
  // only the id will be passed into this handler.
  credentialModel.findById(req.user.id, ['profile_id']).then((credential) => {
    res.status(200).send({
      id: req.user.id,
      profileId: credential.profile_id,
    });
  }).error((err) => {
    next(Object.assign(err, { status: 400 }));
  }).catch(next);
}

function loginWithWeixin(req, res) {
}

function loginWithWeibo(req, res) {
}

function checkIfLoggedIn(req, res) {
  if (req.isAuthenticated()) res.status(200).send({ id: req.user.id });
  else res.status(200).send({ id: null });
}

module.exports = {
  phone: loginWithPhone,
  weixin: loginWithWeixin,
  weibo: loginWithWeibo,
  checkIfLoggedIn,
};
