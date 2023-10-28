
import BaseRedisDao from '../../baseRedisDao';
import NotificationTypesDao from '../../notification/notificationTypes.dao';
import { NotificationTypesModelOutput } from '@/models/notification/notificationTypes.model';

const NOTIFICATION_TYPE_KEY = "NOTIFICATION_TYPE";
const EXPIRY_DURATION = 5 * 60;
export default class NotificationTypesRedisDao extends BaseRedisDao {
  private notificationTypesDao: NotificationTypesDao;

  constructor() {
    super();
    this.notificationTypesDao = new NotificationTypesDao();
  }

  /**
   * fetch active notification types in redis,
   * if not exist then fetch form Database and save it into redis
   * @returns notification types array
   */
  findActiveNotificationType = async (): Promise<NotificationTypesModelOutput[]> => {
    try {
      const redisNotificationTypesData: string = await this.redisClient.get(NOTIFICATION_TYPE_KEY);
      if(redisNotificationTypesData) {
        return JSON.parse(redisNotificationTypesData);
      }
      const notificationTypesData = await this.notificationTypesDao.findActiveNotificationType();

      this.redisClient.set(NOTIFICATION_TYPE_KEY, JSON.stringify(notificationTypesData), "EX", EXPIRY_DURATION);

      return notificationTypesData;
    }
    catch(error) {
      throw error;
    }
  }
}