
/**
 * Subscribe User Queue in RabbitMQ
 */
import connectionEvent from '@/events/connectionEvent';
import FirebaseService from '@services/firebase/firebase.service';
import rabbitmq from '@connections/rabbitmq/rabbitmq';
import { consumerOptions } from '@connections/rabbitmq/rabbitmqConfig';

const routingQueueKey = process.env.FIREBASE_SUBSCRIBE_USER_QUEUE || 'FIREBASE_SUBSCRIBE_USER_QUEUE';
const firebaseServiceInstance = new FirebaseService();

/**
 * consuming data, start after all connections established
 */
connectionEvent.on('ready', () => {
  console.log(`#####STARTED CONSUMING ${routingQueueKey} QUEUE#####`)
  rabbitmq.getRabbitmqInstance().consume(rabbitmq.getChannel(), routingQueueKey, firebaseServiceInstance.subscribeUser, consumerOptions)
});

export default null;
