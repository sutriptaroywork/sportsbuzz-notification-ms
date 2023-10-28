import Routes from "@/src/routes";
import { Router } from "express";

import NotificationAdminRoutes from '@/src/routes/notification/admin/notification.admin.route';
import NotificationUserRoutes from "./user/notification.user.route";

export default class NotificationRoutes implements Routes {
  public path: string;
  public router: Router;
  private adminRoutes: NotificationAdminRoutes;
  private userRoutes: NotificationUserRoutes;

  constructor() {
    this.path = "";
    this.router = Router();
    
    this.adminRoutes = new NotificationAdminRoutes(this.router);
    this.userRoutes = new NotificationUserRoutes(this.router);
  }
}
