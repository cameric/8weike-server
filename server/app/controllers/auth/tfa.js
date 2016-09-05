const tfaService = require('../../services/tfa');

function send(req, res, next) {
  const uid = req.body.uid;

  tfaService.sendCode(uid).then(() => {
    res.status(200).send({ success: true });
  }).error((err) => {
    const errWithStatus = err;
    errWithStatus.status = 400;
    next(errWithStatus);
  }).catch(next);
}

module.exports = {
  send,
};
