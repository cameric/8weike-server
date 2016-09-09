// eslint-disable-next-line import/no-extraneous-dependencies
const credentialModel = require('../models/credential');

// All passport strategies configuration
const LocalStrategy = require('passport-local').Strategy;
const WechatStrategy = require('passport-weixin').Strategy;
const WeiboStrategy = require('../services/passport-weibo').Strategy;

const phoneStrategy = new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'password',
}, (phone, password, done) =>
    credentialModel.loginWithPhone(phone, password)
        .then((credential) => {
          done(null, credential);
          return null;
        }).error((err) => {
          done(null, false, err);
          return null;
        }).catch((err) => {
          done(err);
          return null;
        }));

function serializeUser(user, done) {
  if (!user.id) return done(new Error('User object does not have id property.'), null);
  return done(null, user.id);
}

function deserializeUser(id, done) {
  // TODO: How do we know what columns we want? SELECT * is apparently bad practice
  // Note(tony): at this time we could just return the minimal representation
  // of user: its id. This design is subject to change.
  credentialModel.findById(id, ['id'])
      .then((credential) => {
        done(null, credential);
        return null;
      }).catch((err) => {
        done(err);
        return null;
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
