const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const i18n = require('i18n');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

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
  directives: config.csp.directives,
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

// Configure i18n
i18n.configure({
  locales: config.locale.supported,
  defaultLocale: config.locale.default,
  cookie: config.locale.cookie,
  directory: path.join(__dirname, '/locales'),
  logDebugFn: (msg) => {
    if (process.env.NODE_ENV === 'development') console.log('debug', msg);
  },
  logWarnFn: (msg) => {
    if (process.env.NODE_ENV === 'development') console.log('warn', msg);
  },
  logErrorFn: (msg) => {
    if (process.env.NODE_ENV === 'development') console.log('error', msg);
  },
});
app.use(i18n.init);

// Configure session
app.use(session({
  secret: config.sessionSecret,
  store: new RedisStore(config.redis),
  resave: false,
  saveUninitialized: true,
  // NOTE(tony): before setting up HTTPS,
  // enable cookie transmission in HTTP insecurely
  cookie: config.express.cookie,
}));

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Setup router (order is important)

// Client-side React Router middleware
// Material-UI server-side globals
global.navigator = global.navigator || {};
global.navigator.userAgent = 'all';
app.use(clientRouter);

// REST API top-level router under /api
app.use('/api', router);

// Error handling
if (process.env.NODE_ENV === 'development') {
  // Only log errors in dev
  app.use(errorHandlers.logErrors);
}

app.use(errorHandlers.localizeErrors);
app.use(errorHandlers.clientErrorHandler);
app.use(errorHandlers.serverErrorHandler);

// Unmatched routes, report a 404
app.use(errorHandlers.notFoundError);

module.exports = app;
