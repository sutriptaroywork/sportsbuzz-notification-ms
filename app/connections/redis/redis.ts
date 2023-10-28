import ConnectionProvider, { RedisClient } from '@buzzsports/sportsbuzz11-connection-provider';

import connectionEvent from '../../events/connectionEvent';
import redisConfig from './redisConfig';

export interface RedisClientInterface extends InstanceType<typeof RedisClient> {}
/**
 * creating an instance of ConnectionProvider and initialising redis
 */
const instance = new ConnectionProvider({ redis: redisConfig, connectionEvent });
const connections: RedisClientInterface[] = instance.redisInit();

export const [redisClient]: RedisClientInterface[] = connections;

export default connections;