function loginWithPhone(req, res, next) {
  if (!req.user) {
    const error = new Promise.OperationalError('req.user is null');
    error.status = 400;
    next(error);
  }
  return res.status(302).send(JSON.stringify({ id: req.user.id }));
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
