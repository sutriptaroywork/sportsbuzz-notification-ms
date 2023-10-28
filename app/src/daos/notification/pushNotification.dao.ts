import { ObjectId } from "mongoose";
import BaseMongoDao from "@daos/baseMongoDao";
import PushNotificationModel, { PushNotificationModelInput, PushNotificationModelOutput } from "@models/notification/pushNotification.model";
import { CreatePushNotificationRequestDto } from "@dtos/pushNotification/admin/pushNotificationRequest.dto";
import { HttpException } from "@/library/HttpException/HttpException";
import { MessagesEnglish, StatusCodeEnums, WordEnglish } from "@/enums/commonEnum/commonEnum";
import { GetPushNotificationList, GetPushNotificationListResponse, UpdatePushNotificationObject } from "@interfaces/notification/pushNotification.interface";
import { ListPushNotificationRequestQueryDto } from "@dtos/notification/admin/notificationRequest.admin.dto";
import Utilities from "@/library/Utilities";

const PUSH_NOTIFICATION_PROJECTION = {
  sTitle: 1,
  sDescription: 1,
  ePlatform: 1,
  iAdminId: 1,
  dScheduleTime: 1,
  dCreatedAt: 1,
  eStatus: 1
}

const ADMIN_PROJECTION = {
  sName: 1,
  sUsername: 1,
  eType: 1
}
export default class PushNotificationDao extends BaseMongoDao<PushNotificationModelInput, PushNotificationModelOutput> { 
  constructor(){
    super(PushNotificationModel);
  }

  /**
   * save push notification
   * @param payload 
   * @param payload.sTitle title of push notfication
   * @param payload.sMessage message body of push notfication
   * @param payload.sTopic platform of push notfication
   * @param iAdminId admin's _id
   * @returns created object
   */
  createPushNotificationV1 = async (payload: CreatePushNotificationRequestDto, iAdminId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      let saveObj = {
        sTitle: payload.sTitle,
        sDescription: payload.sMessage,
        ePlatform: payload.sTopic,
        iAdminId,
        dExpTime: new Date(payload.dExpTime)
      }
      const savePushNotification = await this.model.create(saveObj);
      return savePushNotification;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * save push notification
   * @param payload 
   * @param payload.sTitle title of push notfication
   * @param payload.sMessage message body of push notfication
   * @param payload.sTopic platform of push notfication
   * @param iAdminId admin's _id
   * @returns created object
   */
  createPushNotification = async (payload: CreatePushNotificationRequestDto, iAdminId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      let saveObj = {
        sTitle: payload.sTitle,
        sDescription: payload.sMessage,
        ePlatform: payload.sTopic,
        iAdminId
      }
      const savePushNotification = await this.model.create(saveObj);
      return savePushNotification;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get push notification
   * @param pushNotificationId push notification id
   * @returns push notification object
   */
  getPushNotification = async (pushNotificationId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      const result: PushNotificationModelOutput = await this.model.findOne({ _id: pushNotificationId});
      if(!result) {
        throw new HttpException(StatusCodeEnums.BAD_REQUEST, MessagesEnglish.not_exist.replace('##', WordEnglish.cpushNotification));
      }
      return result;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * update push notification
   * @param pushNotificationId push notification _id
   * @param updatePushNotificationObject.iAdminId admin's _id
   * @param updatePushNotificationObject.sTitle title of push notfication
   * @param updatePushNotificationObject.sDescription message body of push notfication
   * @param updatePushNotificationObject.dScheduleTime exipry time
   * @param updatePushNotificationObject.ePlatform platform of push notfication
   * @returns updated object
   */
  findByIdAndUpdateReturnUpdated = async (pushNotificationId: ObjectId, updatePushNotificationObject: UpdatePushNotificationObject): Promise<PushNotificationModelOutput> => {
    try {
      const result: PushNotificationModelOutput = await this.model.findOneAndUpdate({
        _id: pushNotificationId
      }, {
        $set: updatePushNotificationObject
      }, {
        new: true
      });
      return result;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * set push notification eStatus to 0
   * @param pushNotificationId push notification _id
   * @returns updated notification
   */
  deletePushNotification = async (pushNotificationId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      const updatedObject = await this.model.findOneAndUpdate({ _id: pushNotificationId }, { $set: { eStatus: 0 } }, { new: true });
      if(!updatedObject) {
        throw new HttpException(StatusCodeEnums.BAD_REQUEST, MessagesEnglish.not_exist.replace('##', WordEnglish.cpushNotification));
      }
      return updatedObject;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get single active notification
   * @param pushNotificationId push notification _id
   * @returns notification object
   */
  getActivePushNotification = async (pushNotificationId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      const pushNotification = await this.model.findOne({ _id: pushNotificationId, eStatus: 1 });
      if(!pushNotification) {
        throw new HttpException(StatusCodeEnums.BAD_REQUEST, MessagesEnglish.not_exist.replace('##', WordEnglish.cpushNotification));
      }
      return pushNotification;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * fetch list of notifications
   * @param query query filter
   * @returns list of notifications and total count
   */
  getPushNotificationList = async (query: ListPushNotificationRequestQueryDto): Promise<GetPushNotificationListResponse> => {
    try {
      const { dateFrom, dateTo, platform, start: nStart, limit: nLimit, sort: sSorting, search: sSearch } = query;
      const { start, limit, sorting, search } = Utilities.getPaginationValues2({ start: nStart, limit: nLimit, sort: sSorting, search: sSearch });
      console.log(query, start, limit, sorting, search)

      const searchFilter = search ? { sTitle: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : {};
      const datefilter = dateFrom && dateTo ? { dScheduleTime: { $gte: (dateFrom), $lte: (dateTo) } } : {};
      const platformFilter = platform ? { ePlatform: platform } : {};

      const pushNotificationQuery = { ...searchFilter, ...datefilter, ...platformFilter, eStatus: 1 }
      const [pushNotificationList, totalCount]: [GetPushNotificationList[], number] = await Promise.all([
        this.model.find(pushNotificationQuery, PUSH_NOTIFICATION_PROJECTION).sort(sorting).skip(Number(start)).limit(Number(limit)).populate({ path: 'oAdmin', select: ADMIN_PROJECTION }),
        this.model.countDocuments(pushNotificationQuery)
      ]);

      // console.log(pushNotificationList);
      return { results: pushNotificationList, total: totalCount };
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get time range notification
   * @param startTime start time
   * @param endTime end time
   * @returns 
   */
  getCurrentPushNotifications = async (startTime: Date, endTime: Date): Promise<PushNotificationModelOutput[]> => {
    try {
      const list = await this.model.find({
        dExpTime: {
          $gte: startTime,
          $lte: endTime
        }
      }).lean();
      return list;
    }
    catch(error) {
      throw error;
    }
  }
}