// All passport strategies configuration
const LocalStrategy = require('passport-local').Strategy;
const WechatStrategy = require('passport-weixin').Strategy;
// eslint-disable-next-line import/no-extraneous-dependencies
const WeiboStrategy = require('app/services/passport-weibo').Strategy;

function configurePassport(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // Retrieve user by ID
  });

  passport.use(new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password',
  }, (phone, password, done) => {
    // TODO: Database operation to check user
    return done(null, { id: 1 });
  }));

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
