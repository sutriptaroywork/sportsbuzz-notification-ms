import { RedisClientInterface } from "@/connections/redis/redis"

export default class BaseCacheDao {
  redisClient: RedisClientInterface;

  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  setKeyValue = async (serviceName: string, key: string, value: string): Promise<string> => {
    let result: string = await this.redisClient.set(`${serviceName}-${key}`, value)
    return result
  }
  getKeyValue = async (serviceName: string, key: string): Promise<string> => {
    let result: string = await this.redisClient.get(`${serviceName}-${key}`)
    return result
  }
}