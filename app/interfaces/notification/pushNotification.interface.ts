import { ObjectId } from "mongoose";
import { NotificationStatus } from "@/enums/notification/notificationStatus.enum";
import { NotificationTopicEnum } from "@/enums/notification/notificationTopic.enum";
import { AdminModelOutput } from "@models/admin/admin.model";

export default interface PushNotificationInterface {
  _id: ObjectId;
  sTitle: string;
  iAdminId?: ObjectId;
  sDescription: string;
  dScheduleTime?: Date;
  ePlatform?: NotificationTopicEnum;
  eStatus?: NotificationStatus;
  sExternalId?: string;

  dCreatedAt: Date;
  dUpdatedAt: Date;
}

export interface UpdatePushNotificationObject {
  iAdminId: ObjectId;
  sTitle: string;
  sDescription: string;
  dScheduleTime?: Date,
  ePlatform: NotificationTopicEnum
}

interface PushNotificationAdmin extends Pick<AdminModelOutput, 'sName' | 'sUsername' | 'eType'> {}
export interface GetPushNotificationList {
  _id: ObjectId;
  sTitle: String;
  sDescription: string;
  dScheduleTime?: Date;
  ePlatform?: NotificationTopicEnum;
  eStatus?: NotificationStatus;
  dCreatedAt: Date;

  // virtual
  oAdminId?: PushNotificationAdmin | null;
}

export interface GetPushNotificationListResponse {
  results: GetPushNotificationList[];
  total: number;
}