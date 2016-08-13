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

const emailStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  user.loginWithEmail(phone, password, (err, user) => {
    if (err) return done(err);
    return done(null, user);
  });
});

function serializeUser(user, done) {
  done(null, user.id);
}

function deserializeUser(id, done) {
  // Retrieve user by ID
  // TODO: Are we retrieving all columns in the user row? If not, don't use *.
  db.getConnection((err, conn) => {
    if (err) return done(err);

    const queryString = 'SELECT * FROM user WHERE id = ?';

    // eslint-disable-next-line no-shadow
    return conn.query(queryString, [id], (err, res) => {
      conn.release();

      if (err) return done(err);
      return done(null, res);
    });
  });
}

function configurePassport(passport) {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  passport.use(phoneStrategy);
  passport.use(emailStrategy);

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
