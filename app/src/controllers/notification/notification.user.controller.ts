import { Response, Request, NextFunction } from 'express';

import { StatusCodeEnums, MessagesEnglish, WordEnglish } from '@enums/commonEnum/commonEnum';
import NotificationUserService from '@services/notification/notification.user.service';
import { GetUserNotificationResponse } from '@interfaces/notification/notification.interface';
import { ListUserNotificationRequestDto } from '@dtos/notification/user/notificationRequest.user.dto';

export default class NotificationUserController {
  private notificationUserService: NotificationUserService;

  constructor() {
    this.notificationUserService = new NotificationUserService();
  }

  /**
   * fetch unread count
   * @param req request object
   * @param res response object
   * @param next next function
   */
  unreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;
      const count = await this.notificationUserService.getUnreadCount(userId);

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cunreadNotificationCount),
        data: {
          nUnreadCount: count
        }
      });
    } catch (error) {
      console.log('Error in Unread count Notification', error);
      next(error);
    }
  }

  /**
   * fetch list of notifications
   * @param req request object
   * @param res response object
   * @param next next function
   */
  listNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload: ListUserNotificationRequestDto = req.body as any;
      const result: GetUserNotificationResponse[] = await this.notificationUserService.listUserNotification(payload, req.user._id);

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cnotificaitons),
        data: result
      });
    } catch (error) {
      console.log('Error in User list Notification', error);
      next(error);
    }
  }
}
