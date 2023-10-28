import { Schema } from 'mongoose';
import { NotificationsDBConnect } from '@connections/database/mongodb/mongodb';
import AdminModel from '@models/admin/admin.model';
import { NotificationTopicEnum } from '@enums/notification/notificationTopic.enum';
import { NotificationStatus } from '@enums/notification/notificationStatus.enum';
import PushNotificationInterface from '@interfaces/notification/pushNotification.interface';

const PushNotification = new Schema<PushNotificationInterface>({
  sTitle: {
    type: String,
    required: true
  },
  iAdminId: {
    type: Schema.Types.ObjectId,
    ref: AdminModel
  },
  sDescription: {
    type: String,
    required: true
  },
  dScheduleTime: {
    type: Date
  },
  ePlatform: {
    type: String,
    enum: NotificationTopicEnum,
    default: NotificationTopicEnum.All
  },
  eStatus: {
    type: Number,
    enum: NotificationStatus,
    default: NotificationStatus.TRUE
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

PushNotification.virtual('oAdmin', {
  ref: AdminModel,
  localField: 'iAdminId',
  foreignField: '_id',
  justOne: true
})

const PushNotificationModel = NotificationsDBConnect.model('pushNotifications', PushNotification);

export interface PushNotificationModelInput extends Omit<PushNotificationInterface, '_id' | 'dCreatedAt' | 'dUpdatedAt'> {}
export interface PushNotificationModelOutput extends Required<PushNotificationInterface> {}

export default PushNotificationModel;
