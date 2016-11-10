/**
 * Service for connecting and publishing to messaging queue
 * Currently RabbitMQ and CloudAMQP are used.
 */

const amqp = require('amqplib');
const oneLineTrim = require('common-tags/lib/oneLineTrim');
const Promise = require('bluebird');

const config = require('./config/config');

/*
 * When the messaging queue is offline, temporarily save the publishing tasks
 * into this queue so that they could be processed later.
 *
 * NOTE(tony): In order to save the messages in memory, we assume that
 * a message only carries the minimal amount of data needed for consumption.
 * This assumption is a little dangerous as it's hard to predict
 * the content size of a task.
 */
let offlineQueue = [];

/**
 * Gets a connection from the RabbitMQ server.
 * @returns {Promise.<amqp.Connection>} A promise to return a connection.
 */
function getConnection() {
  return amqp.connect(oneLineTrim`${process.env.CLOUDAMQP_URL}?
    heartbeat=${config.rabbitmq.heartbeat}`).disposer((conn) => {
      conn.close();
    });
}

/**
 * Gets a channel for sending tasks to RabbitMQ with a connection
 * @param conn {Object} - A node amqp connection object
 * @returns {Promise.<amqp.Channel>} A promise to return a channel object.
 */
function getChannel(conn) {
  return conn.createConfirmChannel().disposer((ch) => {
    // TODO(tony): Because of a bug in the implementation of `close`, a TypeError will be thrown
    // every time close is called. Comment this line out until a newer version is released.
    // Check this issue for more details:
    // https://github.com/squaremo/amqp.node/issues/297
    // ch.close();
  });
}

/**
 * Gets a connection, creates a ConfirmChannel and pushes a task into the messaging queue.
 * Both the channel and the connection will be closed afterwards. Note that instead of directly
 * pushing into the queue, the exchange -> routing -> queue model is used.
 * @param exchange {string} - A valid exchange. See ./config/config for default value.
 * @param routingKey {string} - A valid routing. See ./config/config for a map of routes.
 * @param content {Object} - A json object as the content
 * @param options {Object} - Optional parameter passed to `publish`
 * @returns {Promise.<Object>} A promise to signify success or failure
 */
function publishTask(exchange, routingKey, content, options = {}) {
  // TODO(tony): come up with a better way to handle dev/prod
  // potentially using multiple queues, but difficult since not all services are running locally
  if (process.env.NODE_ENV !== 'production') {
    return Promise.resolve('Message has been published!');
  }

  // Transform the JSON object into a Node buffer array
  const bufferedContent = Buffer.from(JSON.stringify(content));

  const publish = (ch) => {
    // Promisify the `publish` function in ConfirmChannel mode
    const chAsync = Promise.promisifyAll(ch);

    return ch.assertExchange(exchange, 'direct', options)
        .error(() => Promise.reject(new Promise.OperationalError('Exchange does not exist!')))
        .then(() => chAsync.publishAsync(exchange, routingKey, bufferedContent, options))
        .then(() => Promise.all(offlineQueue.map((task) => chAsync.publishAsync(...task, options)))
        .then(() => {
          // Empty the queue
          offlineQueue = [];
          return Promise.resolve();
        }));
  };

  const publishToChannel = (conn) => Promise.using(getChannel(conn), publish);
  return Promise.using(getConnection(), publishToChannel)
      .error((err) => {
        // Add to offline queue if failed to connected to MQ
        offlineQueue.push([exchange, routingKey, bufferedContent]);
        return Promise.reject(err);
      });
}

module.exports = {
  getChannel,
  publishTask,
};
