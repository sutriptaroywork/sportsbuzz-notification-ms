import { Schema } from 'mongoose';
import { NotificationsDBConnect }from '@connections/database/mongodb/mongodb';
import { NotificationTypeEstatus } from '@enums/notification/notificationTypeEstatus.enum';
import NotificationTypesInterface from '@interfaces/notification/notificationTypes.interface';

const NotificationTypes = new Schema<NotificationTypesInterface>({
  sHeading: {
    type: String 
  },
  sDescription: {
    type: String
  },
  eStatus: {
    type: String, 
    enum: NotificationTypeEstatus,
    default: NotificationTypeEstatus.Y
  },
  sExternalId: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  }
});

const NotificationTypesModel = NotificationsDBConnect.model('notificationtypes', NotificationTypes);

export interface NotificationTypesModelInput extends Omit<NotificationTypesInterface, '_id' | 'dCreatedAt' | 'dUpdatedAt'> {}
export interface NotificationTypesModelOutput extends Required<NotificationTypesInterface> {}
export default NotificationTypesModel;
