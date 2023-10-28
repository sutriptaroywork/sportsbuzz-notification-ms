
import { redisClient } from '@/connections/redis/redis';
import BaseCacheDao from './baseCacheDao';

export default class BaseRedisDao extends BaseCacheDao {
  constructor() {
    super(redisClient);
  }

  getBlackListToken = (token: string) => {
    return this.redisClient.get(`BlackListToken:${token}`);
  }
}