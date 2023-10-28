import { Schema } from 'mongoose';
import { NotificationsDBConnect } from '@connections/database/mongodb/mongodb';
import { NotificationPlatform } from '@enums/notification/notificationPlatform.enum';
import { NotificationMessageKeys } from '@enums/notification/notificationMessageKeys.enum';
import NotificationMessagesInterface from '@interfaces/notification/notificationMessage.interface';

const NotificationMessages = new Schema<NotificationMessagesInterface>({
  sHeading: {
    type: String,
    required: true
  },
  sDescription: {
    type: String,
    required: true
  },
  ePlatform: {
    type: String,
    enum: NotificationPlatform,
    default: NotificationPlatform.ALL
  },
  eKey: {
    type: String,
    enum: NotificationMessageKeys,
    default: NotificationMessageKeys.PLAY_RETURN
  },
  bEnableNotifications: {
    type: Boolean,
    default: true
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

const NotificationMessagesModel = NotificationsDBConnect.model('notificationmessages', NotificationMessages)

export interface NotificationMessagesModelInput extends Omit<NotificationMessagesInterface, '_id' | 'dCreatedAt' | 'dUpdatedAt'> {}
export interface NotificationMessagesModelOutput extends Required<NotificationMessagesInterface> {}
export default NotificationMessagesModel;
