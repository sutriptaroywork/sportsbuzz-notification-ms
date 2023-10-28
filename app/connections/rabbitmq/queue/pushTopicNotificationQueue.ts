
/**
 * Push Topic Notification Queue in RabbitMQ
 */
import connectionEvent from '@/events/connectionEvent';
import FirebaseService from '@services/firebase/firebase.service';
import rabbitmq from '@connections/rabbitmq/rabbitmq';
import { consumerOptions } from '@connections/rabbitmq/rabbitmqConfig';

const routingQueueKey = process.env.PUSH_TOPIC_NOTIFICATION_QUEUE || 'PUSH_TOKEN_NOTIFICATION_QUEUE';
const firebaseServiceInstance = new FirebaseService();

/**
 * for publishing data
 * @param {object} msg
 */
export const publish = async (msg) => {
  rabbitmq.getRabbitmqInstance().publish(rabbitmq.getChannel(), routingQueueKey, msg)
}

/**
 * consuming data, start after all connections established
 */
connectionEvent.on('ready', () => {
  console.log(`#####STARTED CONSUMING ${routingQueueKey} QUEUE#####`)
  rabbitmq.getRabbitmqInstance().consume(rabbitmq.getChannel(), routingQueueKey, firebaseServiceInstance.pushTopicNotification, consumerOptions)
});

export default null;
