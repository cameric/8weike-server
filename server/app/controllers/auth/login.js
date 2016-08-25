function loginWithPhone(req, res) {
  if (!req.user) return res.redirect('/login/phone');
  return res.redirect(`/user/${req.user.id}`);
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
