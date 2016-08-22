/* The entry point for the nSERVER
 * Hoop up everything and run the server.
 */

const app = require('./app/index');
const config = require('./app/config/config');
const db = require('./app/database');
const http = require('http');
const https = require('https');

// Test MySQL database connection
db.getConnection().then((conn) => {
  // Connection OK. Release it and proceed.
  console.log('MySQL connection test successful.');
  conn.release();
}).then((_) => {
  const listenErrorCallback = (port, err) => {
    if (err) {
      console.error('Listening failed: ', err);
      process.exit(10);
    }
    console.log(`Express server listening on http://localhost:${port}`);
  };

  // Start the server
  // TODO: Uncomment the HTTPS lines when
  const server = http.createServer(app);
  //const secureServer = https.createServer(config.express.httpsOptions, app);

  server.listen(config.express.http.port,
      listenErrorCallback.bind(null, config.express.http.port));
  /*secureServer.listen(config.express.https.port,
      listenErrorCallback.bind(null, config.express.https.port));*/
}).catch((err) => {
  console.log(err.stack);
});
