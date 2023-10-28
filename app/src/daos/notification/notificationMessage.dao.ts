import { ObjectId } from "mongoose";
import NotificationMessagesModel, { NotificationMessagesModelInput, NotificationMessagesModelOutput } from "@models/notification/notificationMessage.model";
import BaseMongoDao from "@daos/baseMongoDao";
import { HttpException } from "@/library/HttpException/HttpException";
import { MessagesEnglish, StatusCodeEnums, WordEnglish } from "@/enums/commonEnum/commonEnum";
import { UpdatePushNotificationMessageRequestDto } from "@dtos/notificationMessage/admin/notificationMessageRequest.dto";

export default class NotificationMessagesDao extends BaseMongoDao<NotificationMessagesModelInput, NotificationMessagesModelOutput> { 
  constructor(){
      super(NotificationMessagesModel)
  }

  /**
   * update Notification Message
   * @param notificationId notification message _id
   * @param payload data to be updated
   * @returns updated data
   */
  updateNotificationMessageById = async (notificationId: ObjectId, payload: UpdatePushNotificationMessageRequestDto): Promise<NotificationMessagesModelOutput> => {
    try {
      const notificationData = await this.model.findByIdAndUpdate(notificationId, { $set: payload }, { new: true, runValidators: true });
      if(!notificationData) {
      throw new HttpException(StatusCodeEnums.NOT_FOUND, MessagesEnglish.went_wrong_with.replace('##', WordEnglish.cnotificaiton));
      }
      return notificationData;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get list of notification messages
   * @returns list of notification messages
   */
  getListNotificationMessage = async (): Promise<NotificationMessagesModelOutput[]> => {
    try {
      const list = await this.model.find();
      return list;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get notification messages by id
   * @returns notification messages object
   */
  getListNotificationMessageById = async (notificationId: ObjectId): Promise<NotificationMessagesModelOutput> => {
    try {
      const notificationData = await this.model.findById(notificationId);
      if(!notificationData) {
        throw new HttpException(StatusCodeEnums.NOT_FOUND, MessagesEnglish.not_found.replace('##', WordEnglish.cNotificationMessages));
      }
      return notificationData;
    }
    catch(error) {
      throw error;
    }
  }
}