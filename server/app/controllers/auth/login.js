function loginWithPhone(req, res) {
  if (!req.user) return res.redirect('/api/login/phone');
  return res.redirect(`/api/user/${req.user.id}`);
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
