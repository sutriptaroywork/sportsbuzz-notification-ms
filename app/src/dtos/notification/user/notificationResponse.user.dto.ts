
import { GetUserNotificationResponse } from '@interfaces/notification/notification.interface';

export default class NotificationResponseUserDto {

  public static toResponseUserNotification = (data: GetUserNotificationResponse[]) => {
    return data;
  };
}
