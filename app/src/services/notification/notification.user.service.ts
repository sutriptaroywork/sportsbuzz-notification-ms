import { ObjectId } from 'mongoose';
import NotificationDao from '@daos/notification/notification.dao';
import { GetUserNotificationResponse } from '@interfaces/notification/notification.interface';
import NotificationResponseUserDto from '@/src/dtos/notification/user/notificationResponse.user.dto';

export default class NotificationUserService {
  private notificationDao: NotificationDao;

  constructor() {
    this.notificationDao = new NotificationDao();
  }

  /**
   * fetch unread notification
   * @returns number of unread notification
   */
  getUnreadCount = async (userId: ObjectId): Promise<number> => {
    try {
      let result: number = await this.notificationDao.getUnreadCount(userId);
      return result;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * fetch notifications and update read status
   * @param payload 
   * @param payload.nLimit number limit
   * @param payload.nSkip number skip
   * @param payload.aFilters array of iType
   * @param userId Object Id
   * @returns list of notifications
   */
  listUserNotification = async (payload, userId): Promise<GetUserNotificationResponse[]> => {
    try {
      const notifications: GetUserNotificationResponse[] = await this.notificationDao.getUserNotification(payload, userId);
      const updateIds: ObjectId[] = [];
      const timeIds: ObjectId[] = [];
      notifications.map(s => {
        if (s.dExpTime && !s.eStatus) {
          timeIds.push(s._id)
        } else if (!s.eStatus) {
          updateIds.push(s._id)
        }
      });

      await this.notificationDao.updateUserNotification(updateIds, timeIds, userId);
      return NotificationResponseUserDto.toResponseUserNotification(notifications);
    }
    catch(error) {
      throw error;
    }
  }
}
