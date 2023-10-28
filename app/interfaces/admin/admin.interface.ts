import { UpdateNotificationAdminRequestDto } from "@/src/dtos/notification/admin/notificationRequest.admin.dto";
import { ObjectId } from "mongoose";

export interface AdminJwtToken {
  _id: ObjectId;
  iat: number;
}

export interface updateNotificationServiceParam {
  notificationId: ObjectId;
  notificationData: UpdateNotificationAdminRequestDto;
  iAdminId: ObjectId;
}

export interface FindByIdNotificationAdminResponse {
  _id: ObjectId;
  sName: string;
  sUsername: string;
}