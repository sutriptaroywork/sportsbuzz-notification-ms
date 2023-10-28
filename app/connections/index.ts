// importing all connections and starting it

import mongodbConnection from './database/mongodb/mongodb';
// import mysqlConnection from './database/mysql/mysql';

import redisConnection from './redis/redis';
import rabbitmqConnection from './rabbitmq/rabbitmq';

// initialise queues
import rabbimqQueue from './rabbitmq/queue';

mongodbConnection;
// mysqlConnection;
redisConnection;
rabbitmqConnection;

rabbimqQueue;

export default null;