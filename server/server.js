/* The entry point for the nSERVER
 * Hoop up everything and run the server.
 */

const app = require('./app/index');
const config = require('./app/config/config');

/* Just start the server. all other configurations
 * are in the individual config files.
 */
app.listen(config.express.port, (error) => {
  if (error) {
    console.error('Unable to listen for connections ', error);
    process.exit(10);
  }
  console.log(`Running Express server on http://localhost:${config.express.port}`);
});