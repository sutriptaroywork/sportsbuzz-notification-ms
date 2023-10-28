import { ObjectId } from 'mongoose';
import { FindByIdNotificationAdminResponse } from '@interfaces/admin/admin.interface';
import { FindByIdNotificationUserResponse } from '@interfaces/user/user.interface';
import { NotificationModelOutput } from '@/models/notification/notification.model';
export default interface NotificationInterface {
  _id: ObjectId;
  iUserId?: ObjectId;
  sTitle: string;
  sMessage: string;
  eStatus?: number;
  iType: ObjectId;
  dExpTime?: Date;
  aReadIds?: ObjectId[] | [];
  iAdminId?: ObjectId;
  sExternalId?: string;

  dCreatedAt: Date;
  dUpdatedAt: Date;
}

export interface NotificationByIdProjectionInterface {
  _id: ObjectId;
  iUserId?: ObjectId;
  sTitle: string;
  sMessage: string;
  eStatus?: number;
  iType: ObjectId;
  dExpTime?: Date;
  aReadIds?: ObjectId[] | [];
  iAdminId?: ObjectId;
  dCreatedAt: Date;
}

export interface GetNotificationResponse extends NotificationByIdProjectionInterface {
  oAdmin: FindByIdNotificationAdminResponse | null;
  oUser: FindByIdNotificationUserResponse | null;
}

export interface ListUserNotification {
  nLimit?: number;
  nSkip?: number;
  aFilters?: ObjectId[];
}

export interface GetUserNotificationResponse {
  _id: ObjectId;
  eStatus: string;
  sTitle: string;
  sMessage: string;
  dExpTime?: Date;
  dCreatedAt?: Date
}

export interface GetNotificationListAndCount {
  results: NotificationModelOutput[],
  total: number
}