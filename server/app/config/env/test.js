module.exports = {
  mysql: {
    database: 'circle_test',
    host: 'localhost',
    port: 3306,
    user: 'ubuntu',
    debug: process.env.MYSQL_DEBUG || false,
  },
  cspDirectives: {
    // Fallback whitelist for resource policies not listed below
    defaultSrc: ["'self'"],
    // Valid sources of executable scripts.
    scriptSrc: ["'self'"],
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
