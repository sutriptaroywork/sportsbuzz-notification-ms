import { Response, Request, NextFunction } from 'express';

import { StatusCodeEnums, MessagesEnglish, WordEnglish } from '@enums/commonEnum/commonEnum';
import NotificationCommonService from '@/src/services/notification/notification.common.service';
import { NotificationTypesModelOutput } from '@/models/notification/notificationTypes.model';

export default class NotificationCommonController {
  private notificationCommonService: NotificationCommonService;

  constructor() {
    this.notificationCommonService = new NotificationCommonService();
  }

  /**
   * fetch active notification types
   * @param req request object
   * @param res response object
   * @param next next function
   */
  listTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result: NotificationTypesModelOutput[] = await this.notificationCommonService.listActiveNotificationTypes();

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cnotificationTypes),
        data: result
      });
    } catch (error) {
      console.log('Error in add Notification', error)
      next(error);
    }
  };
}
