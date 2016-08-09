'use strict';

const bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      express = require('express'),
      mysql = require('mysql'),
      path = require('path'),
      passport = require('passport'),
      session = require('express-session');

const config = require('./config/config'),
      passportConfig = require('./config/passport'),
      router = require('./api/router'),
      clientRouter = require('./middlewares/client_router'),
      errorHandlers = require('./middlewares/errors');

// Express server
const app = express();

// Test MySQL Database connection
const connection = mysql.createConnection(config.mysql);
connection.connect((err) => {
    if (err) console.log("Error connecting to MySQL database: " + err);
    else     console.log("Test MySQL connection successfully.");
});
connection.end();

// Set up ejs view engine
app.set('view engine', 'ejs');
app.set('views', path.join(config.webapp.source, 'views'));

// Serve static files
app.use(express.static(path.join(config.root, '/public')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport authentication
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
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
