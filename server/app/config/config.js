'use strict';

const path = require('path');
const envConfig = require('./env/' + process.env.NODE_ENV);

const GENERAL_CONFIG = {
    root: path.normalize(path.join(__dirname, '/../../')),
    express: {
        port: process.env.PORT || 8080
    },
    webapp: {
        folder: '/webapp'
    }
};

module.exports = Object.assign({}, GENERAL_CONFIG, envConfig);