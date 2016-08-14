// eslint-disable-next-line import/no-extraneous-dependencies
const user = require('../models/user');

// All passport strategies configuration
const LocalStrategy = require('passport-local').Strategy;
const WechatStrategy = require('passport-weixin').Strategy;
const WeiboStrategy = require('../services/passport-weibo').Strategy;

const phoneStrategy = new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'password',
}, (phone, password, done) => {
  user.loginWithPhone(phone, password, (err, user) => {
    if (err) return done(err);
    return done(null, user);
  });
});

function serializeUser(user, done) {
  done(null, user.id);
}

function deserializeUser(id, done) {
  // TODO: Are we retrieving all columns in the user row? If not, don't use *.
  user.findById(id, ['*'], (err, res) => {
    if (err) return done(err);
    return done(null, res);
  });
}

function configurePassport(passport) {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  passport.use(phoneStrategy);

  // TODO(tony): Configure third-party login after we have tokens
  passport.use(new WechatStrategy({
    clientID: 'placeholder',
  }, (accessToken, refreshToken, profile, done) => {
  }));

  passport.use(new WeiboStrategy({
    clientID: 'placeholder',
  }, (accessToken, refreshToken, profile, done) => {
  }));
}

module.exports = configurePassport;
