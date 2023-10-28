import { NotificationPlatform } from '@/enums/notification/notificationPlatform.enum';
import { NotificationMessageKeys } from '@/enums/notification/notificationMessageKeys.enum';
import { ObjectId } from 'mongoose';

export default interface NotificationMessagesInterface {
  _id: ObjectId;
  sHeading: string;
  sDescription: string;
  ePlatform: NotificationPlatform;
  eKey: NotificationMessageKeys;
  bEnableNotifications: boolean;
  sExternalId: string;
  dCreatedAt: Date;
  dUpdatedAt: Date;
}