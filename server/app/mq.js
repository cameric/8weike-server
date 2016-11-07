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

function getConnection() {
  return amqp.connect(oneLineTrim`${process.env.CLOUDAMQP_URL}?
    heartbeat=${config.rabbitmq.heartbeat}`).disposer((conn) => {
      conn.close();
    });
}

function getChannel(conn) {
  return conn.createConfirmChannel().disposer((ch) => {
    // TODO(tony): Because of a bug in the implementation of `close`, a TypeError will be thrown
    // every time close is called. Comment this line out until a newer version is released.
    // Check this issue for more details:
    // https://github.com/squaremo/amqp.node/issues/297
    // ch.close();
  });
}

function publishTask(exchange, routingKey, content, options = {}) {
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
