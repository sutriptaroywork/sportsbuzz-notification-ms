
import dotenv from 'dotenv';
dotenv.config();
const config = process.env;

const connectionConfig = {
  exchangeName: 'SB11-Exchange',
  exchangeType: 'direct'
}


interface RabbitmqConfig {
  name: string,
  host: string,
  port: number,
  exchangeName: string,
  exchangeType: string,
  onConnect: () => void,
  onDisconnect: () => void
}

function onConnect() {
  console.log('RabbitMQ Connection Created:', this.name);
}

function onDisconnect() {
  console.log('RabbitMQ Connection Disconnected:', this.name);
}

const rabbitmqConfig: { config: RabbitmqConfig[] } = {
  config: [{
    name: 'RABBITMQ',
    host: String(config.RABBITMQ_URL).split(':').splice(0, String(config.RABBITMQ_URL).split(':').length - 1).join(':'),
    port: Number(String(config.RABBITMQ_URL).split(':').splice(String(config.RABBITMQ_URL).split(':').length - 1).join(':')),
    exchangeName: connectionConfig.exchangeName,
    exchangeType: connectionConfig.exchangeType,
    onConnect,
    onDisconnect
  }]
};

export const consumerOptions = {
  noAck: false
}

export const RABBITMQ_PREFETCH_COUNT = Number(process.env.RABBITMQ_PREFETCH_COUNT) || 0;

export default rabbitmqConfig;