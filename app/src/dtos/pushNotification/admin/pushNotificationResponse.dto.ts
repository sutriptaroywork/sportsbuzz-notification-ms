
import { GetPushNotificationListResponse } from '@/interfaces/notification/pushNotification.interface';
import { PushNotificationModelOutput } from '@/models/notification/pushNotification.model';

export default class PushNotificationResponseAdminDto {
  public static toResponse = (data: PushNotificationModelOutput): PushNotificationModelOutput => {
    return data;
  };

  public static toResponsePushNotificationList = (data: GetPushNotificationListResponse) => {
    return data;
  }
}
