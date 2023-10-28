import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongoose';

import { NotificationModelOutput } from '@models/notification/notification.model';
import NotificationAdminService from '@services/notification/notification.admin.service'
import { AddNotificationAdminRequestDto, GetNotificationV2RequestQueryDto, ListNotificationV2RequestQueryDto, ListPushNotificationRequestQueryDto, NotificationIdDto, UpdateNotificationAdminRequestDto, UpdateNotificationAdminRequestParamsDto } from '@dtos/notification/admin/notificationRequest.admin.dto';
import { StatusCodeEnums, MessagesEnglish, WordEnglish } from '@enums/commonEnum/commonEnum';
import { AddNotificationAdminTimedRequestDto } from '@dtos/notification/admin/notificationRequest.admin.dto';
import NotificationDao from '@daos/notification/notification.dao';
import { GetNotificationListAndCount, GetNotificationResponse, NotificationByIdProjectionInterface } from '@interfaces/notification/notification.interface';
import { PushNotificationModelOutput } from '@/models/notification/pushNotification.model';
import { CreatePushNotificationRequestDto, DeletePushNotificationRequestParamsDto, GetPushNotificationRequestParamsDto, UpdatePushNotificationRequestDto, UpdatePushNotificationRequestParamsDto } from '@dtos/pushNotification/admin/pushNotificationRequest.dto';
import PushNotificationDao from '@daos/notification/pushNotification.dao';
import { GetPushNotificationListResponse } from '@/interfaces/notification/pushNotification.interface';
import { GetPushNotificationMessageParamsRequestDto, UpdatePushNotificationMessageParamsRequestDto, UpdatePushNotificationMessageRequestDto } from '@dtos/notificationMessage/admin/notificationMessageRequest.dto';
import { NotificationMessagesModelOutput } from '@/models/notification/notificationMessage.model';

export default class NotificationAdminController {
  private notificationAdminService: NotificationAdminService;
  private notificationDao: NotificationDao;
  private pushNotificationDao: PushNotificationDao;

  constructor() {
    this.notificationAdminService = new NotificationAdminService();
    this.notificationDao = new NotificationDao();
    this.pushNotificationDao = new PushNotificationDao();
  }

  /**
   * Add notification for the single user
   * @param req request object
   * @param res response object
   * @param next next function
   */
  add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let payload: AddNotificationAdminRequestDto = req.body as any;

      // if(!req.admin) {
      //   req.admin = {
      //     _id: new Schema.Types.ObjectId(payload.iUserId),
      //   };
      // }
      const adminId: ObjectId = req.admin._id;

      const result: NotificationModelOutput = await this.notificationAdminService.addNotification(payload, adminId);

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.add_success.replace('##', WordEnglish.cnotificaiton),
        data: result
      });
    } catch (error) {
      console.log('Error in add Notification', error)
      next(error);
    }
  };

  /**
   * Add Timed notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
  addTimedNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: AddNotificationAdminTimedRequestDto = req.body as any;

      const result: NotificationModelOutput = await this.notificationAdminService.addTimedNotification(payload);

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.sent_success.replace('##', WordEnglish.cnotificaiton),
        data: result
      });
    }
    catch(error) {
      console.log('Error in add Timed Notification', error)
      next(error);
    }
  }

  /**
   * use to update notification, only applicable for timed notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
  updateNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: UpdateNotificationAdminRequestDto = req.body as any;
      const params: UpdateNotificationAdminRequestParamsDto = req.params as any;
      const adminId: ObjectId = req.admin._id;

      const result: NotificationModelOutput = await this.notificationAdminService.updateNotification({
        notificationId: params.id,
        notificationData: payload,
        iAdminId: adminId
      });

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.update_success.replace('##', WordEnglish.cnotificaiton),
        data: result
      });
    }
    catch(error) {
      console.log('Error in Update Notification', error)
      next(error);
    }
  }

  /**
   * fetch list of notifications
   * @param req request object
   * @param res response object
   * @param next next function
   */
  listNotificationV2 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: ListNotificationV2RequestQueryDto = req.query as any;

      const result: GetNotificationListAndCount = await this.notificationAdminService.listNotificationV2(payload);

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cnotificaiton),
        data: [result]
      });
    }
    catch(error) {
      console.log('Error in List Notification V2', error)
      next(error);
    }
  }

  getNotificationV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: GetNotificationV2RequestQueryDto = req.params as any;

      const notificationData: NotificationByIdProjectionInterface = await this.notificationAdminService.getNotificationV1(params.id);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cnotificaiton),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Get Notification V1', error)
      next(error);
    }
  }
  /**
   * fetch single notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
  getNotificationV2 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: GetNotificationV2RequestQueryDto = req.params as any;

      const notificationData: GetNotificationResponse = await this.notificationAdminService.getNotification(params.id);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cnotificaiton),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Get Notification V2', error)
      next(error);
    }
  }

  /**
   * delete a notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
  deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: NotificationIdDto = req.params as any;

      const notificationData: NotificationModelOutput = await this.notificationAdminService.deleteNotification(params.id);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.del_success.replace('##', WordEnglish.cnotificaiton),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Delete Notification V2', error)
      next(error);
    }
  }

  /**
   * create push notification V1
   * @param req request object
   * @param res response object
   * @param next next function
   */
  createPushNotificationV1 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('inside pushNotification function');

      const payload: CreatePushNotificationRequestDto = req.body as any;
      const adminId = req.admin._id;
      const notificationData: PushNotificationModelOutput = await this.notificationAdminService.createPushNotificationV1(payload, adminId);

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.schedule_success.replace('##', WordEnglish.cpushNotification),
        data: notificationData
      });
    } catch (error) {
      console.log('Error in Creating Push Notification V1', error)
      next(error);
    }
  }

   /**
   * create push notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
   createPushNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: CreatePushNotificationRequestDto = req.body as any;
      const adminId = req.admin._id;
      const notificationData: PushNotificationModelOutput = await this.notificationAdminService.createPushNotification(payload, adminId);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.schedule_success.replace('##', WordEnglish.cpushNotification),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Creating Push Notification', error)
      next(error);
    }
  }

   /**
   * update push notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
   updatePushNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: UpdatePushNotificationRequestDto = req.body as any;
      const params: UpdatePushNotificationRequestParamsDto = req.params as any;
      const adminId = req.admin._id;

      const notificationData: PushNotificationModelOutput = await this.notificationAdminService.updatePushNotification(payload, params.id, adminId);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.update_success.replace('##', WordEnglish.cpushNotification),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Updating Push Notification', error)
      next(error);
    }
  }

   /**
   * delete timed push notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
   deletePushNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: DeletePushNotificationRequestParamsDto = req.params as any;

      const notificationData: PushNotificationModelOutput = await this.notificationAdminService.deletePushNotification(params.id);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.del_success.replace('##', WordEnglish.cpushNotification),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Deleting Push Notification', error)
      next(error);
    }
  }

   /**
   * get single push notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
   getPushNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: GetPushNotificationRequestParamsDto = req.params as any;

      const notificationData: PushNotificationModelOutput = await this.pushNotificationDao.getActivePushNotification(params.id);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cpushNotification),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Deleting Push Notification', error)
      next(error);
    }
  }

  /**
   * get list of push notification
   * @param req request object
   * @param res response object
   * @param next next function
   */
  getPushNotificationList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: ListPushNotificationRequestQueryDto = req.params as any;

      const notificationData: GetPushNotificationListResponse = await this.notificationAdminService.listPushNotification(payload);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cpushNotification),
        data: [notificationData]
      });
    }
    catch(error) {
      console.log('Error in Listing Push Notification', error)
      next(error);
    }
  }

  /**
   * update notification message [not being used]
   * @param req request object
   * @param res response object
   * @param next next function
   */
  updateNotificationMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: UpdatePushNotificationMessageRequestDto = req.body as any;
      const params: UpdatePushNotificationMessageParamsRequestDto = req.params as any;

      const notificationData: NotificationMessagesModelOutput = await this.notificationAdminService.updateNotificationMessage(params.id, payload);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.update_success.replace('##', WordEnglish.cNotificationMessages),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Updating Notification Message', error)
      next(error);
    }
  }

  /**
   * get list of notification message
   * @param req request object
   * @param res response object
   * @param next next function
   */
  getListNotificationMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notificationData: NotificationMessagesModelOutput[] = await this.notificationAdminService.getListNotificationMessage();
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cNotificationMessages),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in Listing of Notification Message', error)
      next(error);
    }
  }

  /**
   * get notification message by id
   * @param req request object
   * @param res response object
   * @param next next function
   */
  getListNotificationMessageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: GetPushNotificationMessageParamsRequestDto = req.params as any;
      const notificationData: NotificationMessagesModelOutput = await this.notificationAdminService.getListNotificationMessageById(params.id);
      
      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.success.replace('##', WordEnglish.cNotificationMessages),
        data: notificationData
      });
    }
    catch(error) {
      console.log('Error in fetching of Notification Message', error)
      next(error);
    }
  }

  /**
   * Send Topic Notification
   * @param req 
   * @param res 
   * @param next 
   */
  sendPushNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.notificationAdminService.sendPushNotification();

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        message: MessagesEnglish.sent_success.replace('##', WordEnglish.cpushNotification),
        data: result
      });
    }
    catch (error) {
      next(error)
    }
  };
}
