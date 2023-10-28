import Routes from "@/src/routes";
import { Router } from "express";

import validationMiddleware from "@/middleware/validation.middleware";
import { UserRequestDto } from "@dtos/userRequestDto/userRequestDto";
import { AddNotificationAdminRequestDto, UpdateNotificationAdminRequestDto } from '@/src/dtos/notification/admin/notificationRequest.admin.dto';
import { AddNotificationAdminTimedRequestDto } from '@/src/dtos/notification/admin/notificationRequest.admin.dto';
import NotificationAdminController from '@/src/controllers/notification/notification.admin.controller';
import AdminAuthenticationMiddleware from '@/middleware/adminAuthentication.middleware';
import CommonMiddleware from "@/middleware/common.middleware";
import NotificationCommonController from "@controllers/notification/notification.common.controller";
import { CreatePushNotificationRequestDto, DeletePushNotificationRequestParamsDto, GetPushNotificationRequestParamsDto, UpdatePushNotificationRequestDto, UpdatePushNotificationRequestParamsDto } from "@dtos/pushNotification/admin/pushNotificationRequest.dto";
import { UpdatePushNotificationMessageRequestDto } from "@dtos/notificationMessage/admin/notificationMessageRequest.dto";

export default class NotificationAdminRoutes implements Routes {
  public path: string;
  public router: Router;
  private adminAuthenticationMiddleware: AdminAuthenticationMiddleware;
  private commonMiddleware: CommonMiddleware;
  private notificationAdminController: NotificationAdminController;
  private notificationCommonController: NotificationCommonController;

  constructor(router: Router) {
    this.path = "/admin";
    this.router = router;

    this.adminAuthenticationMiddleware = new AdminAuthenticationMiddleware();
    this.commonMiddleware = new CommonMiddleware();

    this.notificationAdminController = new NotificationAdminController();
    this.notificationCommonController = new NotificationCommonController();

    this.initializeRoutes();
  }

  initializeRoutes = (): void => {
    
    this.router.post(`${this.path}/notification/v1`, validationMiddleware(AddNotificationAdminRequestDto, 'body'), this.adminAuthenticationMiddleware.validateAdmin('NOTIFICATION', 'W'), this.notificationAdminController.add);

    this.router.post(`${this.path}/notification/timed/v1`, validationMiddleware(AddNotificationAdminTimedRequestDto, 'body'), this.adminAuthenticationMiddleware.validateAdmin('NOTIFICATION', 'W'), this.notificationAdminController.addTimedNotification);

    this.router.get(`${this.path}/notification/types/v1`, /*cacheRoute(5 * 60),*/ this.commonMiddleware.setLanguage, this.notificationCommonController.listTypes);

    this.router.put(`${this.path}/notification/:id/v1`, validationMiddleware(UpdateNotificationAdminRequestDto, 'body'), this.adminAuthenticationMiddleware.validateAdmin('NOTIFICATION', 'W'), this.notificationAdminController.updateNotification);

    // router.get('/admin/notification/list/v1', validateAdmin('NOTIFICATION', 'R'), notificationsServices.listNotification) // deprecated
    this.router.get(`${this.path}/notification/list/v2`, this.adminAuthenticationMiddleware.validateAdmin('NOTIFICATION', 'R'), this.notificationAdminController.listNotificationV2);

    this.router.get('/admin/notification/:id/v1', this.adminAuthenticationMiddleware.validateAdmin('NOTIFICATION', 'R'), this.notificationAdminController.getNotificationV1) // deprecated
    this.router.get(`${this.path}/notification/:id/v2`, this.adminAuthenticationMiddleware.validateAdmin('NOTIFICATION', 'R'), this.notificationAdminController.getNotificationV2)

    this.router.delete(`${this.path}/notification/:id/v1`, this.adminAuthenticationMiddleware.validateAdmin('NOTIFICATION', 'W'), this.notificationAdminController.deleteNotification)

    this.router.post(`${this.path}/push-notification/v1`, validationMiddleware(CreatePushNotificationRequestDto, 'body'), this.adminAuthenticationMiddleware.validateAdmin('PUSHNOTIFICATION', 'W'), this.notificationAdminController.createPushNotification);

    this.router.put(`${this.path}/push-notification/:id/v1`, validationMiddleware(UpdatePushNotificationRequestParamsDto, 'params'), validationMiddleware(UpdatePushNotificationRequestDto, 'body'), this.adminAuthenticationMiddleware.validateAdmin('PUSHNOTIFICATION', 'W'), this.notificationAdminController.updatePushNotification);

    this.router.delete(`${this.path}/push-notification/:id/v1`, validationMiddleware(DeletePushNotificationRequestParamsDto, 'params'), this.adminAuthenticationMiddleware.validateAdmin('PUSHNOTIFICATION', 'W'), this.notificationAdminController.deletePushNotification);

    this.router.get(`${this.path}/push-notification/:id/v1`, validationMiddleware(GetPushNotificationRequestParamsDto, 'params'), this.adminAuthenticationMiddleware.validateAdmin('PUSHNOTIFICATION', 'R'), this.notificationAdminController.getPushNotification);

    this.router.get(`${this.path}/push-notification-list/v1`, this.adminAuthenticationMiddleware.validateAdmin('PUSHNOTIFICATION', 'R'), this.notificationAdminController.getPushNotificationList)

    this.router.put(`${this.path}/notification-message/:id/v1`, validationMiddleware(UpdatePushNotificationMessageRequestDto, 'body'), this.adminAuthenticationMiddleware.validateAdmin('PUSHNOTIFICATION', 'W'), this.notificationAdminController.updateNotificationMessage);
    
    this.router.get(`${this.path}/notification-message-list/v1`, this.adminAuthenticationMiddleware.validateAdmin('PUSHNOTIFICATION', 'R'), this.notificationAdminController.getListNotificationMessage);

    this.router.get(`${this.path}/notification-message/:id/v1`, this.adminAuthenticationMiddleware.validateAdmin('PUSHNOTIFICATION', 'R'), this.notificationAdminController.getListNotificationMessageById);

    // router.post('/admin/push-notification/v2', validators.adminPushNotification, validateAdmin('PUSHNOTIFICATION', 'W'), notificationsServices.pushNotificationV2)

    // notification cron, runs in every minute
    this.router.post(`${this.path}/cron/push-notification/v1`, this.notificationAdminController.sendPushNotification);
  };
}
