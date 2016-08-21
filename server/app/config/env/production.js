module.exports = {
  mysql: {
    database: process.env.MYSQL_RDS_DB_PROD_NAME,
    host: process.env.MYSQL_RDS_DB_PROD_HOST,
    password: process.env.MYSQL_RDS_DB_PROD_PASSWORD,
    port: process.env.MYSQL_RDS_DB_PROD_PORT,
    user: process.env.MYSQL_RDS_DB_PROD_USER,
    ssl: 'Amazon RDS',
  },
  cspDirectives: {
    // Fallback whitelist for resource policies not listed below
    defaultSrc: ["'self'"],
    // Valid sources of executable scripts.
    scriptSrc: ["'self'", "*.8weike.com"],
    // Valid sources of styles.
    styleSrc: ["'self'"],
    // Valid sources of images.
    imgSrc: ["'self'"],
    // Valid sources of Flash objects nad other plugins.
    objectSrc: [],
    // URL to which browsers will send reports when a content security policy is violated.
    reportUri: null,
  },
};