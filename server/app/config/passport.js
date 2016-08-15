// eslint-disable-next-line import/no-extraneous-dependencies
const userModel = require('../models/user');

// All passport strategies configuration
const LocalStrategy = require('passport-local').Strategy;
const WechatStrategy = require('passport-weixin').Strategy;
const WeiboStrategy = require('../services/passport-weibo').Strategy;

const phoneStrategy = new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'password',
}, (phone, password, done) =>
    userModel.loginWithPhone(phone, password).then(done.bind(null, null)).catch(done));

function serializeUser(user, done) {
  if (!user.id) return done(new Error('User object does not have id property.'), null);
  return done(null, user.id);
}

function deserializeUser(id, done) {
  // TODO: Are we retrieving all columns in the user row? If not, don't use *.
  userModel.findById(id, ['*']).then(done.bind(null, null)).catch(done);
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
