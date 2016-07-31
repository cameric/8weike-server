'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/config');
const Router = require('./api/router');

// Express server
const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(config.root, config.webapp.folder));

// Serve static files
app.use(express.static(path.join(config.root, config.webapp.folder)));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setup router
var router = new Router(app);
router.setup();

module.exports = app;
