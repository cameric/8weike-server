const NONCE_HASH = require('../../services/utils').generateHashWithDate();

module.exports = {
  mysql: {
    database: 'circle_test',
    host: 'localhost',
    port: 3306,
    user: 'ubuntu',
    debug: process.env.MYSQL_DEBUG || false,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    ttl: 260,
    logErrors: true,
  },
  csp: {
    nonceHash: NONCE_HASH,
    directives: {
      // Fallback whitelist for resource policies not listed below
      defaultSrc: ["'self'"],
      // Valid sources of executable scripts.
      scriptSrc: ["'self'", `'nonce-${NONCE_HASH}'`],
      // Valid sources of styles.
      styleSrc: ["'self'", "https://fonts.googleapis.com", `'nonce-${NONCE_HASH}'`],
      // Valid sources of fonts
      fontSrc: ["https://fonts.gstatic.com", "https://maxcdn.bootstrapcdn.com"],
      // Valid sources of images.
      imgSrc: ["'self'", "data:"],
      // Valid sources of Flash objects nad other plugins.
      objectSrc: [],
      // URL to which browsers will send reports when a content security policy is violated.
      reportUri: null,
    },
  },
};
