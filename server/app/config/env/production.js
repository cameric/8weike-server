const NONCE_HASH = require('../../services/utils').generateHashWithDate();

module.exports = {
  mysql: {
    database: process.env.MYSQL_RDS_DB_PROD_NAME,
    host: process.env.MYSQL_RDS_DB_PROD_HOST,
    password: process.env.MYSQL_RDS_DB_PROD_PASSWORD,
    port: process.env.MYSQL_RDS_DB_PROD_PORT,
    user: process.env.MYSQL_RDS_DB_PROD_USER,
    ssl: 'Amazon RDS',
  },
  redis: {
    host: 'redis',
    port: 6379,
    ttl: 260,
  },
  csp: {
    nonceHash: NONCE_HASH,
    directives: {
      // Fallback whitelist for resource policies not listed below
      defaultSrc: ["'self'"],
      // Valid sources of executable scripts.
      scriptSrc: ["'self'", "*.8weike.com", `'nonce-${NONCE_HASH}'`],
      // Valid sources of styles.
      styleSrc: ["'self'", "https://fonts.googleapis.com", `'nonce-${NONCE_HASH}'`],
      // Valid sources of fonts
      fontSrc: ["https://fonts.gstatic.com"],
      // Valid sources of images.
      imgSrc: ["'self'", "*.8weike.com", "data:"],
      // Valid sources of Flash objects nad other plugins.
      objectSrc: [],
      // URL to which browsers will send reports when a content security policy is violated.
      reportUri: null,
    },
  },
};