'use strict';

const bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      express = require('express'),
      mysql = require('mysql'),
      path = require('path');

const config = require('./config/config'),
      Router = require('./api/router'),
      webpack = require('webpack'),
      webpackConfig = require('../webpack.config');

// Express server
const app = express();
const bundler = webpack(webpackConfig);

// Test MySQL Database connection
const connection = mysql.createConnection(config.mysql);
connection.connect((err) => {
    if (err) console.log("Error connecting to MySQL database: " + err);
    else     console.log("Test MySQL connection successfully.");
});
connection.end();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(config.root, config.webapp.folder));

// Serve static files and compiled js
app.use(express.static(path.join(config.root, config.webapp.folder)));
app.use(require('webpack-dev-middleware')(bundler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setup router
var router = new Router(app);
router.setup();

module.exports = app;
