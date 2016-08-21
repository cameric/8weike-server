module.exports = {
  mysql: {
    database: '8weike_db_dev',
    host: 'database',
    password: 'dbdevmaster',
    port: 3306,
    user: 'dbdevmaster',
    debug: process.env.MYSQL_DEBUG || false,
  },
  cspDirectives: {
    // Fallback whitelist for resource policies not listed below
    defaultSrc: ["'self'"],
    connectSrc: ["'self'", "localhost:*", "ws:"],
    // Valid sources of executable scripts.
    scriptSrc: ["'self'", "'unsafe-inline'"],
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
