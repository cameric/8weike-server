const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');

const config = require('./config/config');
const db = require('./database');
const passportConfig = require('./config/passport');
const router = require('./api/router');
const clientRouter = require('./middlewares/client_router');
const errorHandlers = require('./middlewares/errors');

// Express server
const app = express();

// Test MySQL database connection
db.getConnection().then((conn) => {
  console.log('MySQL connection test successful.');
  conn.release();
}).catch((err) => {
  console.log(`Error connecting to MySQL database: ${err}`);
});

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
