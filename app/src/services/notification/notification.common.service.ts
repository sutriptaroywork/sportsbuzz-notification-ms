import { NotificationTypesModelOutput } from '@/models/notification/notificationTypes.model';
import NotificationTypesDao from '@daos/notification/notificationTypes.dao';
import NotificationTypesRedisDao from '@daos/redis/notification/notificationTypesRedis.dao';
import NotificationResponseCommonDto from '@dtos/notificationTypes/common/notificationResponse.common.dto';

export default class NotificationCommonService {
  private notificationTypesDao: NotificationTypesDao;
  private notificationTypesRedisDao: NotificationTypesRedisDao;

  constructor() {
    this.notificationTypesDao = new NotificationTypesDao();
    this.notificationTypesRedisDao = new NotificationTypesRedisDao();
  }

  /**
   * fetch active notification types
   * @returns list of notification types
   */
  listActiveNotificationTypes = async (): Promise<NotificationTypesModelOutput[]> => {
    try {
      let result: NotificationTypesModelOutput[] = await this.notificationTypesRedisDao.findActiveNotificationType();
      return NotificationResponseCommonDto.toResponseNotificationTypesArray(result);
    }
    catch(error) {
      throw error;
    }
  }
}
