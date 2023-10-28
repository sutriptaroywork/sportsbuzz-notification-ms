import { Schema } from 'mongoose';
import { NotificationsDBConnect } from '@connections/database/mongodb/mongodb';
import UserModel from '@models/userModel/userModel';
import NotificationTypesModel from '@models/notification/notificationTypes.model';
import AdminModel from '@models/admin/admin.model';
import { NotificationStatus } from '@enums/notification/notificationStatus.enum';
import NotificationInterface from '@interfaces/notification/notification.interface';

const Notifications = new Schema<NotificationInterface>({
  iUserId: {
    type: Schema.Types.ObjectId,
    ref: UserModel
  },
  sTitle: {
    type: String
  },
  sMessage: {
    type: String
  },
  eStatus: {
    type: Number,
    enum: NotificationStatus,
    default: NotificationStatus.FALSE
  },
  iType: {
    type: Schema.Types.ObjectId,
    ref: NotificationTypesModel
  },
  dExpTime: {
    type: Date
  },
  aReadIds: {
    type: [Schema.Types.ObjectId],
    ref: UserModel,
    default: []
  },
  iAdminId: {
    type: Schema.Types.ObjectId,
    ref: AdminModel
  },
  sExternalId: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
  },
  toJSON: {
    virtuals: true,
  }
});

Notifications.index({ iUserId: 1, iType: 1, dExpTime: 1 })

Notifications.virtual('oAdminNotification', {
  ref: AdminModel,
  localField: 'iAdminId',
  foreignField: '_id',
  justOne: true
})

Notifications.virtual('oUserNotification', {
  ref: UserModel,
  localField: 'iUserId',
  foreignField: '_id',
  justOne: true
})

const NotificationModel = NotificationsDBConnect.model('notifications', Notifications);

export interface NotificationModelInput extends Omit<NotificationInterface, '_id' | 'dCreatedAt' | 'dUpdatedAt'> {}
export interface NotificationModelOutput extends Required<NotificationInterface> {}

export default NotificationModel;
