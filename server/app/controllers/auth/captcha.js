const captchaService = require('../../services/captcha');

function get(req, res, next) {
  captchaService.get(req.body).then((data) => {
    res.status(200).send(data);
  }).catch(next);
}

module.exports = {
  get,
};
