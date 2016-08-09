'use strict';

// Set the node environment variable if not set from docker config
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');
const envConfig = require('./env/' + process.env.NODE_ENV);

const ROOT = path.normalize(path.join(__dirname, '/../../'));
const GENERAL_CONFIG = {
    root: ROOT,
    express: {
        port: process.env.PORT || 8080
    },
    sessionSecret: '8weike-terces',
    dev: {
        port: 8888,
        path: '/dev'
    },
    webapp: {
        source: path.join(ROOT, '/webapp'),
        output: path.join(ROOT, '/public/build'),
        // Make the publicPath same as output for now. If we use CDN
        // in the future, no need to change every publicPath in webpack
        publicPath: '/build'
    },
    mysql: {
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        host     : process.env.RDS_HOSTNAME,
        port     : process.env.RDS_PORT,
        database : process.env.RDS_DB_NAME,
        ssl      : "Amazon RDS"
    }
};

module.exports = Object.assign({}, GENERAL_CONFIG, envConfig);