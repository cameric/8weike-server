const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');
const session = require('express-session');

const config = require('./config/config');
const passportConfig = require('./config/passport');
const router = require('./api/router');
const clientRouter = require('./middlewares/client-router');
const errorHandlers = require('./middlewares/errors');

const app = express();

/**
 * Modify HTTP header defaults to protect against a variety of well-known web vulnerabilities
 * See https://www.npmjs.com/package/helmet for details.
 *
 * TODO: Some of these fixes cause minor decreases in performance. It shouldn't matter for now,
 * but it may be worth benchmarking later.
 */
app.use(helmet());

// Use whitelists to defend against XSS
app.use(helmet.contentSecurityPolicy({
  directives: config.cspDirectives,
  // false = Browsers will block and report violations
  reportOnly: false,
  // false = Don't natively set all CSP headers; the right one will be detected from the user agent
  setAllHeaders: false,
  // false = Keep CSP enable for Android, where it can potentially be buggy
  disableAndroid: false,
  // true = Don't globally disable user-agent sniffing
  browserSniff: true,
}));

/* TODO: Uncomment this when we have certs + their SHA256 hashes in env vars for use below
app.use(helmet.hpkp({
  maxAge: 7776000000,       // 90 days, in milliseconds
  sha256s: [],              // TODO: Add SHA256es for our certs --- use env var
  includeSubdomains: true,
  reportOnly: false,
  reportUri: null,
}));
*/

// Set up ejs view engine
app.set('view engine', 'ejs');
app.set('views', path.join(config.webapp.source, 'views'));

// Serve static files
app.use(express.static(path.join(config.root, '/public')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport authentication
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Setup router (order is important)

// Client-side React Router middleware
app.use(clientRouter);
// REST API top-level router under /api
app.use('/api', router);

// Error handling
app.use(errorHandlers.logErrors);
app.use(errorHandlers.serverErrors);

// Unmatched routes, report a 404
app.use(errorHandlers.notFoundError);

module.exports = app;
