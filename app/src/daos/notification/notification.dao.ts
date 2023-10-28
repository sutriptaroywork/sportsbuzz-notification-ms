import { ObjectId, Schema } from "mongoose";
import NotificationModel, { NotificationModelInput, NotificationModelOutput } from "@models/notification/notification.model";
import BaseMongoDao from "@daos/baseMongoDao";
import { ListNotificationV2RequestQueryDto } from "@dtos/notification/admin/notificationRequest.admin.dto";
import Utilities from "@/library/Utilities";
import { HttpException } from "@/library/HttpException/HttpException";
import { MessagesEnglish, StatusCodeEnums, WordEnglish } from "@enums/commonEnum/commonEnum";
import { GetNotificationListAndCount, GetUserNotificationResponse, ListUserNotification, NotificationByIdProjectionInterface } from "@interfaces/notification/notification.interface";
import { updateNotificationServiceParam } from "@/interfaces/admin/admin.interface";

const bAllowDiskUse = true;
const NOTIFICATION_PROJECTION = {
  iUserId: 1,
  sTitle: 1,
  sMessage: 1,
  eStatus: 1,
  iType: 1,
  dExpTime: 1,
  aReadIds: 1,
  iAdminId: 1,
  dCreatedAt: 1
}
export default class NotificationDao extends BaseMongoDao<NotificationModelInput, NotificationModelOutput> { 
  constructor(){
    super(NotificationModel)
  }

  /**
   * fetch list of notifications
   * @param query query filter
   * @returns list of notifications
   */
  getNotificationListAndCount = async (query: ListNotificationV2RequestQueryDto): Promise<GetNotificationListAndCount> => {
    try {
      const { iType, dDateFrom, dDateTo, nStart, nLimit, sSorting, sSearch } = query;
      const { start, limit, sorting } = Utilities.getPaginationValues2({ start: nStart, limit: nLimit, sort: sSorting });

      const iTypeFilter = iType ? { iType } : {}
      const datefilter = dDateFrom && dDateTo ? { $and: [{ dExpTime: { $gte: (dDateFrom) } }, { dExpTime: { $lte: (dDateTo) } }] } : {}
      const searchFilter = sSearch ? { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } } : {}

      const notificationQuery = { ...iTypeFilter, ...datefilter, ...searchFilter }

      const [notificationList, count] = await Promise.all([
        this.model.find(notificationQuery, NOTIFICATION_PROJECTION).sort(sorting).skip(Number(start)).limit(Number(limit)).populate('oAdminNotification', 'sName sUsername eType').populate('oUserNotification', 'sName sUsername sMobnum'),
        this.model.countDocuments(notificationQuery)
      ]);

      return {
        results: notificationList,
        total: count
      };
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * fetch single notification
   * @param notificationId notification _id
   * @returns notification object
   */
  getNotificationById = async (notificationId: ObjectId): Promise<NotificationByIdProjectionInterface> => {
    try {
      const notificationData: NotificationByIdProjectionInterface = await this.model.findOne({
        _id: notificationId
      }, NOTIFICATION_PROJECTION).lean();
      if(!notificationData) {
        throw new HttpException(StatusCodeEnums.NOT_FOUND, MessagesEnglish.not_found.replace('##', WordEnglish.cnotificaiton));
      }
      return notificationData;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * delete a notification
   * @param notificationId notification _id
   * @returns deleted object
   */
  deleteNotificationById = async (notificationId: ObjectId): Promise<NotificationModelOutput> => {
    try {
      const notificationData: NotificationModelOutput = await this.model.findByIdAndDelete(notificationId);
      if(!notificationData) {
        throw new HttpException(StatusCodeEnums.NOT_FOUND, MessagesEnglish.not_found.replace('##', WordEnglish.cnotificaiton));
      }
      return notificationData;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get unread notification count
   * @param userId user _id
   * @returns number of unread notification count
   */
  getUnreadCount = async (userId: ObjectId): Promise<number> => {
    try {
      const { unreadCount } = await this.model.aggregate([
        {
          $match: {
            $or: [{
              iUserId: userId
            }, {
              dExpTime: {
                $gte: new Date()
              }
            }]
          } 
        },
        {
          $project: {
            status: {
              $cond: [
                '$dExpTime',
                {
                  $cond: [{
                    $in: [userId, '$aReadIds']
                  }, 1, 0] 
                },
                '$eStatus']
            }
          }
        },
        {
          $match: {
            status: 0
          }
        },
        {
          $count: "unreadCount"
        }
      ]);

      return unreadCount;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get user list of notification
   * @param payload 
   * @param payload.nLimit number limit
   * @param payload.nSkip number skip
   * @param payload.aFilters array of iType
   * @param userId Object Id
   * @returns list of notifications
   */
  getUserNotification = async (payload: ListUserNotification, userId: ObjectId): Promise<GetUserNotificationResponse[]> => {
    try {
      let { nLimit, nSkip, aFilters }: ListUserNotification = payload as any;
      nLimit = parseInt(String(nLimit)) || 20;
      nSkip = parseInt(String(nSkip)) || 0;

      let matchQuery = {
        $or: [{
          iUserId: userId
        }, {
          dExpTime: {
            $gte: new Date()
          }
        }]
      }

      let matchQueryFinal;
      if (aFilters && aFilters.length) {
        const filterQuery = {
          $or: []
        }
        aFilters.map(s => filterQuery.$or.push({ iType: new Schema.Types.ObjectId(String(s)) }));
        matchQueryFinal = {
          ...matchQuery,
          $and: [filterQuery]
        }
      }
      else {
        matchQueryFinal = matchQuery;
      }

      const notifications = await this.model.aggregate([
        {
          $match: matchQueryFinal
        },
        {
          $project: {
            _id: 1,
            eStatus: {
              $cond: [
                '$dExpTime',
                { $cond: [{ $in: [userId, '$aReadIds'] }, 1, 0] },
                '$eStatus']
            },
            sTitle: 1,
            sMessage: 1,
            dExpTime: 1,
            dCreatedAt: 1
          }
        },
        { $sort: { dCreatedAt: -1 } },
        { $skip: nSkip },
        { $limit: nLimit }
      ]).allowDiskUse(bAllowDiskUse).exec();
      return notifications;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * update notification
   * @param updateIds array of notification _id to update eStatus
   * @param timeIds array of notification _id to update aReadIds
   * @param userId user _id
   */
  updateUserNotification = async (updateIds: ObjectId[], timeIds: ObjectId[], userId: ObjectId) => {
    try {
      let promiseArr = [];
      if (updateIds.length) {
        promiseArr.push(this.model.updateMany({ _id: { $in: updateIds } }, { $set: { eStatus: 1 } }));
      }
      if (timeIds.length) {
        promiseArr.push(this.model.updateMany({ _id: { $in: timeIds } }, { $addToSet: { aReadIds: userId } }))
      }
      await Promise.all(promiseArr);
    }
    catch(error) {
      throw error;
    } 
  }

  /**
   * find notification by id and update
   * @param updateObj data to be updated
   * @returns updated object
   */
  findByIdAndUpdateReturn = async (updateObj: updateNotificationServiceParam): Promise<NotificationModelOutput> => {
    try {
      const { notificationId, notificationData, iAdminId } = updateObj;
      const updatedNotification = await this.model.findByIdAndUpdate(
        notificationId, {
          ...notificationData,
          iAdminId
        }, {
          new: true,
          runValidators: true
        }
      );
      if(!updatedNotification) {
        throw new HttpException(StatusCodeEnums.NOT_FOUND, MessagesEnglish.not_found.replace('##', WordEnglish.cnotificaiton));
      }
      return updatedNotification;
    }
    catch(error) {
      throw error;
    }
  }
}