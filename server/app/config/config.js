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
    // NOTE: Many public networks (e.g. hotel wifi) block HTTP/HTTPS on nonstandard ports.
    // For production, PORT and PORT_SECURE should always be 80 and 443, respectively.
    http: {
      port: process.env.PORT || 8080,
    },
    https: {
      port: process.env.PORT_SECURE || 8443,
      key: null,  // TODO
      cert: null, // TODO
    },
    cookie: {
      // TODO: Set this to true after we have HTTPS enabled
      secure: false,
      maxAge: 3600000,
      httpOnly: true,
    },
  },
  locale: {
    default: 'zh-CN',
    supported: ['zh-CN', 'en'],
    cookie: '8weike-user-locale',
  },
  sessionSecret: '8weike-terces',
  crypto: {
    bcryptSaltRounds: 12,
    tfaSecretLength: 20,
  },
  dev: {
    port: 8888,
    path: '/dev',
  },
  sms: {
    url: 'https://sms.yunpian.com/v1',
    apiKey: '2847caf78d61a130bb058962d18bac8c',
  },
  upload: {
    diskLocation: path.join(root, '/tmp/uploads'),
    tmpSpecifier: 'tmp',
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
