const authyModel = require('../../models/authy');

function getCode(req, res, next) {
  const { authyId } = req.body;
  authyModel.sendCodeWithAuthy(authyId)
    .then(() => { res.status(200).send({success: true}); })
    .error(next)
    .catch(next);
}

function verify(req, res, next) {
  const { authyId, code } = req.body;
  authyModel.verifyWithAuthy(authyId, code)
    .then(() => { res.status(200).send({success: true}); })
    .error((err) => {
      const errWithStatus = err;
      errWithStatus.status = 400;
      next(errWithStatus);
    })
    .catch(next);
}

module.exports = {
  getCode,
  verify,
};
