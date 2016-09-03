const NONCE_HASH = require('../../services/utils').generateHashWithDate();

module.exports = {
  mysql: {
    database: '8weike_db_dev',
    host: 'database',
    password: 'dbdevmaster',
    port: 3306,
    user: 'dbdevmaster',
    debug: process.env.MYSQL_DEBUG || false,
  },
  csp: {
    nonceHash: NONCE_HASH,
    directives: {
      // Fallback whitelist for resource policies not listed below
      defaultSrc: ["'self'"],
      // Valid source to construct web socket to
      connectSrc: ["'self'", "localhost:*", "ws:"],
      // Valid sources of executable scripts.
      scriptSrc: ["'self'", `'nonce-${NONCE_HASH}'`],
      // Valid sources of styles.
      styleSrc: ["'self'", "https://fonts.googleapis.com", `'nonce-${NONCE_HASH}'`],
      // Valid sources of fonts
      fontSrc: ["https://fonts.gstatic.com"],
      // Valid sources of images.
      imgSrc: ["'self'"],
      // Valid sources of Flash objects nad other plugins.
      objectSrc: [],
      // URL to which browsers will send reports when a content security policy is violated.
      reportUri: null,
    },
  },
};
