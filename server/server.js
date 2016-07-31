'use strict';

/* The entry point for the nSERVER
 * Hoop up everything and run the server.
 */

// Set the node environment variable if not set from docker config
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = require('./app/index');
const config = require('./app/config/config');

/* Just start the server. all other configurations
 * are in the individual config files.
 */
app.listen(config.express.port, function (error) {
    if (error) {
        console.error('Unable to listen for connections ', error);
        process.exit(10);
    }
    console.log('Running Express server on http://localhost:' + config.express.port);
});