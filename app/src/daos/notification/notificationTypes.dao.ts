import NotificationTypesModel, { NotificationTypesModelInput, NotificationTypesModelOutput } from "@models/notification/notificationTypes.model";
import BaseMongoDao from "@daos/baseMongoDao";

export default class NotificationTypesDao extends BaseMongoDao<NotificationTypesModelInput, NotificationTypesModelOutput> { 
  constructor(){
    super(NotificationTypesModel)
  }

  /**
   * fetch active notification types
   * @returns notification types array
   */
  findActiveNotificationType = (): NotificationTypesModelOutput[] => {
    return this.model.find({
      eStatus: 'Y'
    }).lean();
  }
}