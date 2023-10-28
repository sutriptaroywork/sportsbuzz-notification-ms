import { NotificationTypeEstatus } from '@/enums/notification/notificationTypeEstatus.enum';
import { ObjectId } from 'mongoose';
export default interface NotificationTypesInterface {
  _id: ObjectId;
  sHeading: string;
  sDescription: string;
  eStatus: NotificationTypeEstatus;
  sExternalId: string;
  dCreatedAt: Date;
  dUpdatedAt: Date;
}