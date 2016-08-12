const path = require('path');

// TODO: This still produces a warning in Webpack. See the related Trello card:
// https://trello.com/c/SlWm4UVn
const envConfig = require(`./env/${process.env.NODE_ENV || 'development'}`);

// TODO: There's probably a nicer way to do this that doesn't need a ../../
const APP_ROOT = path.normalize(path.join(__dirname, '/../../'));

const generalConfig = {
  root: APP_ROOT,
  express: {
    port: process.env.PORT || 8080,
  },
  sessionSecret: '8weike-terces',
  dev: {
    port: 8888,
    path: '/dev',
  },
  webapp: {
    source: path.join(APP_ROOT, '/webapp'),
    output: path.join(APP_ROOT, '/public/build'),
    // Make the publicPath same as output for now. If we use CDN
    // in the future, no need to change every publicPath in webpack
    publicPath: '/build',
  },
  mysql: {
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME,
    ssl: 'Amazon RDS',
  },
};

module.exports = Object.assign({}, generalConfig, envConfig);
