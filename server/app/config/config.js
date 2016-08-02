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