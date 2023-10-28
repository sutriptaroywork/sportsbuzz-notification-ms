import ConnectionProvider, { RabbitMQConnection, RabbitmqConnectionClient, RabbitmqChannelClient } from '@buzzsports/sportsbuzz11-connection-provider';

import connectionEvent from '../../events/connectionEvent';
import rabbitmqConfig, { RABBITMQ_PREFETCH_COUNT, consumerOptions } from './rabbitmqConfig';


interface RabbitmqConnectionInterface {
  instance: InstanceType<typeof RabbitMQConnection>,
  connection: RabbitmqConnectionClient
}

interface DefaultInterface {
  getRabbitmqInstance: () => InstanceType<typeof RabbitMQConnection>,
  getChannel: () => RabbitmqChannelClient,
  acknowledge: (data) => void
}
/**
 * creating an instance of ConnectionProvider and initialising rabbitmq
 * initialize function is a promise
 */
const instance = new ConnectionProvider({ rabbitmq: rabbitmqConfig, connectionEvent });
// channel can be queue specific, with specific prefetch count
let channel: RabbitmqChannelClient;
let rabbitmqInstance: InstanceType<typeof RabbitMQConnection>;

(async () => {
  try {
    const [firstConnection]: RabbitmqConnectionInterface[] = await instance.rabbitmqInit();

    const connection: RabbitmqConnectionClient = firstConnection.connection;
    rabbitmqInstance = firstConnection.instance;
    channel = await connection.createChannel();

    // It will only work if noAck is false in consumer
    // limit the unacknowledge messges in the consumer
    if(!consumerOptions.noAck) {
      channel.prefetch(RABBITMQ_PREFETCH_COUNT);
    }

    process.once('SIGINT', async () => {
      // console.log('RabbitMQ Graceful shutdown')
      await connection.close()
    });
  } catch (e) {
    console.error('RabbitMQ Connection Error', e)
  }
})()

const acknowledge = (data) => {
  if(!consumerOptions.noAck) {
    channel.ack(data)
  }
}

// exporting instance and channel
const defaultValue: DefaultInterface = {
  getRabbitmqInstance: () => rabbitmqInstance,
  getChannel: () => channel,
  acknowledge
};

export default defaultValue;