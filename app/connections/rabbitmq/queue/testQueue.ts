
/**
 * Test queue in RabbitMQ
 */
import connectionEvent from '../../../events/connectionEvent';
import rabbitmq from '../rabbitmq';
import { consumerOptions } from '@connections/rabbitmq/rabbitmqConfig';

const routingQueueKey = process.env.TEST_QUEUE || 'TEST_QUEUE';

/**
 * for publishing data
 * @param {object} msg
 */
const publish = async (msg) => {
  rabbitmq.getRabbitmqInstance().publish(rabbitmq.getChannel(), routingQueueKey, msg)
}

const testCallback = (data) => {
  try {
    console.log('Testing RabbitMQ Queue', JSON.parse(data.content));
    // for acknowledgement
    rabbitmq.acknowledge(data);
  } catch (e) {
    // console.log(e);
  }
}

/**
 * consuming data, start after all connections established
 */
connectionEvent.on('ready', () => {
  console.log(`#####STARTED CONSUMING ${routingQueueKey} QUEUE#####`)
  rabbitmq.getRabbitmqInstance().consume(rabbitmq.getChannel(), routingQueueKey, testCallback, consumerOptions)
  setInterval(() => {
    console.log('publishing')
    publish({ name: 'test' });
  }, 5000)
})

/**
 * can create your own channel here using connection 
 * single channel for a single queue
 * so that you can define your prefetch count
 */

export default {
  publish
}
