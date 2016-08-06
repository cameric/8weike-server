'use strict';

const bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      compression = require('compression'),
      express = require('express'),
      mysql = require('mysql'),
      path = require('path');

const config = require('./config/config'),
      Router = require('./api/router'),
      clientRouter = require('./middlewares/client_router');

// Express server
const app = express();

// Compress if in production environment
if (process.env.NODE_ENV === 'production') {
    app.use(compression);
}

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
app.use(express.static(config.webapp.output));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setup router

// Client-side React Router middleware
app.use(clientRouter);

// REST API router
var router = new Router(app);
router.setup();

module.exports = app;
