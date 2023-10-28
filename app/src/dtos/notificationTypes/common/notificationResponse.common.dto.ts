
import { NotificationTypesModelOutput } from '@/models/notification/notificationTypes.model';

export default class NotificationResponseCommonDto {
  public static toResponseNotificationTypesArray = (data: Array<NotificationTypesModelOutput>) => {
    return data;
  };
}
