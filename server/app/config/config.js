// Set the node environment variable if not set from docker config
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');

const development = require('./env/development');
const production = require('./env/production');
const test = require('./env/test');

const root = path.join(__dirname, '/../../');

const defaults = {
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
};

// Merge the defaults with dev/test/prod configs
const configs = {
  development: Object.assign({}, defaults, development),
  test: Object.assign({}, defaults, test),
  production: Object.assign({}, defaults, production),
};

// Export only the config specified by NODE_ENV
module.exports = configs[process.env.NODE_ENV];

