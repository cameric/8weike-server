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

function getChannel() {
  const createChannel = (conn) => conn.createConfirmChannel().disposer((ch) => {
    ch.close();
  });

  return Promise.using(getConnection(), createChannel);
}

function checkConnection(exchange, options = {}) {
  const checkExchange = (ch) => ch.assertExchange(exchange, 'direct', options)
      .then((_) => ch);

  return Promise.using(getChannel(), checkExchange);
}

function publishTask(exchange, routingKey, content, options = {}) {
  return checkConnection(exchange)
      .error((err) => {
        // Add to offline queue if failed to connected to MQ
        offlineQueue.push([exchange, routingKey, content]);
        return Promise.reject(err);
      })
      // Promisify the `publish` function in ConfirmChannel mode
      .then((ch) => Promise.promisifyAll(ch))
      .then((ch) => Promise.all(offlineQueue.map((task) => ch.publishAsync(...task, options)))
          .then((_) => {
            // Empty the queue
            offlineQueue = [];
            return ch;
          }))
      .then(ch => ch.publishAsync(exchange, routingKey, content, options));
}

module.exports = {
  getChannel,
  publishTask,
};
