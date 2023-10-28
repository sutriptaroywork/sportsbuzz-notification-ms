
import { FindByIdNotificationUserResponse } from '@interfaces/user/user.interface';
import { FindByIdNotificationAdminResponse } from '@interfaces/admin/admin.interface';
import { GetNotificationResponse, NotificationByIdProjectionInterface } from '@interfaces/notification/notification.interface';
import { NotificationModelOutput } from '@models/notification/notification.model';

export default class NotificationResponseAdminDto {
  public static toResponseArray = (data: Array<NotificationModelOutput>) => {
    return data;
  };

  public static toResponse = (data: NotificationModelOutput) => {
    return data;
  };

  public static toResponseNotificationById = (data: NotificationByIdProjectionInterface) => {
    return data;
  };

  public static getNotificationResponse = ( notificationData: NotificationByIdProjectionInterface,  oAdmin: FindByIdNotificationAdminResponse, oUser: FindByIdNotificationUserResponse): GetNotificationResponse => {
    return {
      ...notificationData,
      oAdmin,
      oUser
    }
  }
}
