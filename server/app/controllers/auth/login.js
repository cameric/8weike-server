function loginWithPhone(req, res, next) {
  if (!req.user) next(new Promise.OperationalError('req.user is null'));
  return res.status(200).send(JSON.stringify({ id: req.user.id }));
}

function loginWithWeixin(req, res) {
}

function loginWithWeibo(req, res) {
}

module.exports = {
  phone: loginWithPhone,
  weixin: loginWithWeixin,
  weibo: loginWithWeibo,
};
