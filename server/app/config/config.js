// Set the node environment variable if not set from docker config
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envConfig = require(`./env/${process.env.NODE_ENV}`);
const path = require('path');

const root = path.normalize(path.join(__dirname, '/../../'));

const generalConfig = {
  root,
  express: {
    port: process.env.PORT || 8080,
  },
  sessionSecret: '8weike-terces',
  dev: {
    port: 8888,
    path: '/dev',
  },
  webapp: {
    source: path.join(root, '/webapp'),
    output: path.join(root, '/public/build'),
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
