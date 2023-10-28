import Routes from "@/src/routes";
import { Router } from "express";

import validationMiddleware from "@/middleware/validation.middleware";
import CommonMiddleware from "@/middleware/common.middleware";
import NotificationCommonController from "@controllers/notification/notification.common.controller";
import UserAuthenticationMiddleware from "@/middleware/userAuthentication.middleware";
import NotificationUserController from "@/src/controllers/notification/notification.user.controller";
import { ListUserNotificationRequestDto } from "@dtos/notification/user/notificationRequest.user.dto";

export default class NotificationUserRoutes implements Routes {
  public path: string;
  public router: Router;
  private userAuthenticationMiddleware: UserAuthenticationMiddleware;
  private commonMiddleware: CommonMiddleware;
  private notificationCommonController: NotificationCommonController;
  private notificationUserController: NotificationUserController;

  constructor(router: Router) {
    this.path = "/user/notification";
    this.router = router;

    this.commonMiddleware = new CommonMiddleware();
    this.userAuthenticationMiddleware = new UserAuthenticationMiddleware();
    this.notificationCommonController = new NotificationCommonController();
    this.notificationUserController = new NotificationUserController();

    this.initializeRoutes();
  }

  initializeRoutes = (): void => {
    this.router.get(`${this.path}/types/v1`, /*cacheRoute(5 * 60),*/ this.commonMiddleware.setLanguage, this.notificationCommonController.listTypes)
    this.router.get(`${this.path}/unread-count/v1`, this.userAuthenticationMiddleware.isUserAuthenticated, this.notificationUserController.unreadCount);
    this.router.post(`${this.path}/list/v1`, validationMiddleware(ListUserNotificationRequestDto, 'body'), this.userAuthenticationMiddleware.isUserAuthenticated, this.notificationUserController.listNotification);
  };
}
