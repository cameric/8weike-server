// eslint-disable-next-line import/no-extraneous-dependencies
const db = require('../services/database');

// All passport strategies configuration
const LocalStrategy = require('passport-local').Strategy;
const WechatStrategy = require('passport-weixin').Strategy;
const WeiboStrategy = require('../services/passport-weibo').Strategy;

const phoneStrategy = new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'password',
}, (phone, password, done) => {
  // Connect to the database
  db.getConnection((err, conn) => {
    if (err) return done(err);

    // Select by phone + password
    const queryString = 'SELECT id FROM user WHERE phone = ? AND password = ?';

    // Query the DB **using a paramaterized query**. This prevents SQL injection.
    // TODO(spencer): This is OK for now, but consider using a connection pool later.
    // See https://github.com/mysqljs/mysql#pooling-connections
    // eslint-disable-next-line no-shadow
    return conn.query(queryString, [phone, password], (err, res) => {
      // Close the connection
      conn.release();

      if (err) return done(err);
      return done(null, res);
    });
  });
});

const emailStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  db.getConnection((err, conn) => {
    if (err) return done(err);

    // Select by email + password
    const queryString = 'SELECT id FROM user WHERE email = ? AND password = ?';

    // eslint-disable-next-line no-shadow
    return conn.query(queryString, [email, password], (err, res) => {
      conn.release();

      if (err) return done(err);
      return done(null, res);
    });
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
