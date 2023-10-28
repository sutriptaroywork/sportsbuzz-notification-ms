import { ObjectId } from 'mongoose';
import dayjs from 'dayjs';

import { HttpException } from "@/library/HttpException/HttpException";

import { UserModelOutput } from "@models/userModel/userModel";
import { NotificationModelInput, NotificationModelOutput } from "@models/notification/notification.model";

import UserDao from "@daos/userDaos/userDaos";
import NotificationDao from "@daos/notification/notification.dao";

import { UserRequestDto } from "@dtos/userRequestDto/userRequestDto";
import UserResponseDto from "@dtos/userResponseDto/userResponseDto";
import { AddNotificationAdminRequestDto, ListNotificationV2RequestQueryDto, ListPushNotificationRequestQueryDto } from "@dtos/notification/admin/notificationRequest.admin.dto";
import { AddNotificationAdminTimedRequestDto } from '@dtos/notification/admin/notificationRequest.admin.dto';

import { StatusCodeEnums, MessagesEnglish, WordEnglish } from '@enums/commonEnum/commonEnum';
import { FindByIdNotificationAdminResponse, updateNotificationServiceParam } from '@interfaces/admin/admin.interface';
import NotificationResponseAdminDto from '@dtos/notification/admin/notificationResponse.admin.dto';
import { GetNotificationListAndCount, GetNotificationResponse, NotificationByIdProjectionInterface } from '@interfaces/notification/notification.interface';
import { FindByIdNotificationUserResponse } from '@interfaces/user/user.interface';
import AdminDao from '@daos/admin/admin.dao';
import PushNotificationDao from '@daos/notification/pushNotification.dao';
import { PushNotificationModelOutput } from '@models/notification/pushNotification.model';
import PushNotificationResponseDto from '@dtos/pushNotification/admin/pushNotificationResponse.dto';
import { CreatePushNotificationRequestDto, UpdatePushNotificationRequestDto } from '@dtos/pushNotification/admin/pushNotificationRequest.dto';
import { GetPushNotificationListResponse, UpdatePushNotificationObject } from '@interfaces/notification/pushNotification.interface';
import PushNotificationResponseAdminDto from '@dtos/pushNotification/admin/pushNotificationResponse.dto';
import NotificationMessagesDao from '@daos/notification/notificationMessage.dao';
import { NotificationMessagesModelOutput } from '@/models/notification/notificationMessage.model';
import { UpdatePushNotificationMessageRequestDto } from '@dtos/notificationMessage/admin/notificationMessageRequest.dto';
import NotificationTypesDao from '@/src/daos/notification/notificationTypes.dao';
import { publish as pushTopicNotificationQueuePublish } from '@connections/rabbitmq/queue/pushTopicNotificationQueue';
import { publish as pushTokenNotificationQueuePublish } from '@connections/rabbitmq/queue/pushNotificationQueue';
import { PushTopicNotificationQueueInterface } from '@/interfaces/firebase/firebase.interface';


export default class NotificationAdminService {
  private userDao: UserDao;
  private adminDao: AdminDao;
  private notificationDao: NotificationDao;
  private notificationTypesDao: NotificationTypesDao;
  private pushNotificationDao: PushNotificationDao;
  private notificationMessagesDao: NotificationMessagesDao;

  private userDto: UserRequestDto;
  private userResponseDto: UserResponseDto;
  private notificationResponseAdminDto: NotificationResponseAdminDto;
  private pushNotificationResponseAdminDto: PushNotificationResponseDto;

  constructor() {
    this.userDao = new UserDao();
    this.adminDao = new AdminDao();
    this.notificationDao = new NotificationDao();
    this.notificationTypesDao = new NotificationTypesDao();
    this.pushNotificationDao = new PushNotificationDao();
    this.notificationMessagesDao = new NotificationMessagesDao();
    this.userResponseDto = new UserResponseDto();
    this.notificationResponseAdminDto = new NotificationResponseAdminDto();
    this.pushNotificationResponseAdminDto = new PushNotificationResponseAdminDto();
  }

  /**
   * Add notification for the single user
   * @param notificationData new notification data to be saved
   * @param iAdminId _id of the admin who is creating the notification
   * @returns saved notification
   */
  addNotification = async (notificationData: AddNotificationAdminRequestDto, iAdminId: ObjectId): Promise<NotificationModelOutput> => {
    try {
      // getting user's data for the token(push notification)
      const user: UserModelOutput = await this.userDao.findById(String(notificationData.iUserId));
      if(!user) {
        throw new HttpException(StatusCodeEnums.NOT_FOUND, MessagesEnglish.went_wrong_with.replace('##', WordEnglish.cuserId));
      }
  
      // For any notification add, we required it's type like profile, promotional, transaction, etc.
      const ntExist = await this.notificationTypesDao.findById(String(notificationData.iType));
      if(!ntExist) {
        throw new HttpException(StatusCodeEnums.NOT_FOUND, MessagesEnglish.went_wrong_with.replace('##', WordEnglish.cnotificationType));
      }
  
      // saving the notification into notification table
      const notificationObj: NotificationModelInput = {
        ...notificationData,
        iAdminId
      }
      const savedNotification: NotificationModelOutput = await this.notificationDao.create(notificationObj);

      // TODO send push notification to the user
      // sendNotification(user.aJwtTokens, notificationData.sTitle, notificationData.sMessage)
      const { sTitle, sMessage } = savedNotification;
      console.log(notificationData, iAdminId, user);
      const [token] = user.aJwtTokens.slice(-1);
      if(token) {
        pushTokenNotificationQueuePublish({
          token: token.sPushToken,
          title: sTitle,
          body: sMessage
        });
      }

      return savedNotification;
    }
    catch(error) {
      throw error;
    }
  };

  /**
   * Add timed notification
   * @param notificationData 
   * @returns saved notification
   */
  addTimedNotification = async (notificationData: AddNotificationAdminTimedRequestDto): Promise<NotificationModelOutput> => {
    try {
      const dTime = new Date(notificationData.dExpTime);
      if (dTime.getTime() < (new Date().getTime())) {
        throw new HttpException(StatusCodeEnums.BAD_REQUEST, MessagesEnglish.schedule_date_err);
      }

      // TODO why are we not saving iAdminId
      const savedNotification = await this.notificationDao.create({ ...notificationData, aReadIds: [] });
      return savedNotification;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * use to update notification, only applicable for timed notification
   * @param updateObj notification table _id, data to be updated, admin's _id
   * @returns updated data
   */
  updateNotification = async (updateObj: updateNotificationServiceParam): Promise<NotificationModelOutput> => {
    try {
      const updatedNotification: NotificationModelOutput = await this.notificationDao.findByIdAndUpdateReturn(updateObj);
      return updatedNotification;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * fetch list of notifications
   * @param query fetch query
   * @returns list of notifications
   */
  listNotificationV2 = async (query: ListNotificationV2RequestQueryDto): Promise<GetNotificationListAndCount> => {
    try {
      const { results, total }: GetNotificationListAndCount = await this.notificationDao.getNotificationListAndCount(query);
      return {
        results: NotificationResponseAdminDto.toResponseArray(results),
        total
      };
    }
    catch(error) {
      throw error;
    }
  }

  getNotificationV1 = async (notificationId: ObjectId): Promise<NotificationByIdProjectionInterface> => {
    try {
      const result: NotificationByIdProjectionInterface = await this.notificationDao.getNotificationById(notificationId);

      return NotificationResponseAdminDto.toResponseNotificationById(result);
    }
    catch(error) {
      throw error;
    }
  }
  /**
   * fetch single notification
   * @param notificationId notification _id
   * @returns object with notification, admin, user's data
   */
  getNotification = async (notificationId: ObjectId): Promise<GetNotificationResponse> => {
    try {
      const result: NotificationByIdProjectionInterface = await this.notificationDao.getNotificationById(notificationId);
      
      const [adminData, userData]: [FindByIdNotificationAdminResponse, FindByIdNotificationUserResponse] = await Promise.all([
        this.adminDao.findByIdNotification(result.iAdminId),
        this.userDao.findByIdNotification(result.iUserId)
      ]);

      return NotificationResponseAdminDto.getNotificationResponse(result, adminData, userData);
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
  deleteNotification = async (notificationId: ObjectId): Promise<NotificationModelOutput> => {
    try {
      const result: NotificationModelOutput = await this.notificationDao.deleteNotificationById(notificationId);

      return NotificationResponseAdminDto.toResponse(result);
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
   * @param payload.dExpTime scheduled time
   * @param iAdminId admin's _id
   * @returns created object
   */
  createPushNotificationV1 = async (payload: CreatePushNotificationRequestDto, adminId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      const { dExpTime } = payload;
      const dTime = new Date(dExpTime);
      if (dTime.getTime() < new Date().getTime()) {
        throw new HttpException(StatusCodeEnums.BAD_REQUEST, MessagesEnglish.schedule_date_err);
      }

      const result: PushNotificationModelOutput = await this.pushNotificationDao.createPushNotificationV1(payload, adminId);

      // TODO send scheduled notification
      // await redisClient.zadd('scheduler', Number(+dTime), JSON.stringify({ _id: data._id.toString(), sTopic, sTitle, sMessage, queueName: 'NOTIFY' }))
      return PushNotificationResponseDto.toResponse(result);
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
  createPushNotification = async (payload: CreatePushNotificationRequestDto, adminId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      const result: PushNotificationModelOutput = await this.pushNotificationDao.createPushNotification(payload, adminId);

      // TODO send notification
      const { ePlatform, sTitle, sDescription } = result;
      pushTopicNotificationQueuePublish({ topic: ePlatform, title: sTitle, body: sDescription });
      // await notificationSchedulerV2(data)
      return PushNotificationResponseDto.toResponse(result);
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * update push notification
   * @param payload 
   * @param payload.sTitle title of push notfication
   * @param payload.sMessage message body of push notfication
   * @param payload.sTopic platform of push notfication
   * @param payload.dExpTime exipry time
   * @param pushNotificationId push notification _id
   * @param iAdminId admin's _id
   * @returns updated object
   */
  updatePushNotification = async (payload: UpdatePushNotificationRequestDto, pushNotificationId: ObjectId, iAdminId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      const result: PushNotificationModelOutput = await this.pushNotificationDao.getPushNotification(pushNotificationId);

      const dTime = payload.dExpTime ? +new Date(payload.dExpTime) : +new Date(result.dScheduleTime);

      if (dTime < (+new Date()) || (dTime < (+new Date() + 60000))) {
        throw new HttpException(StatusCodeEnums.BAD_REQUEST, MessagesEnglish.schedule_date_err);
      }

      const updateObj: UpdatePushNotificationObject =  {
        iAdminId,
        sTitle: payload.sTitle,
        sDescription: payload.sMessage,
        dScheduleTime: new Date(dTime),
        ePlatform: payload.sTopic
      }

      // TODO
      // await redisClient.zrem('scheduler', JSON.stringify({ _id: req.params.id, sTopic: data?.ePlatform, sTitle: data?.sTitle, sMessage: data?.sDescription, queueName: 'NOTIFY' }))
      // await redisClient.zadd('scheduler', Number(dTime), JSON.stringify({ _id: req.params.id, sTopic, sTitle, sMessage, queueName: 'NOTIFY' }))

      const updatedData: PushNotificationModelOutput = await this.pushNotificationDao.findByIdAndUpdateReturnUpdated(pushNotificationId, updateObj);
      return PushNotificationResponseDto.toResponse(updatedData);
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * delete notification, set push notification eStatus to 0
   * @param pushNotificationId push notification _id
   * @returns updated notification
   */
  deletePushNotification = async (pushNotificationId: ObjectId): Promise<PushNotificationModelOutput> => {
    try {
      const updatedObject = await this.pushNotificationDao.deletePushNotification(pushNotificationId);

      // TODO
      // await redisClient.zrem('scheduler', JSON.stringify({ _id: req.params.id, sTopic: data?.ePlatform, sTitle: data?.sTitle, sMessage: data?.sDescription, queueName: 'NOTIFY' }))
      return updatedObject;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * list of push notifications
   * @param query filters
   * @returns notification list and total count
   */
  listPushNotification = async (query: ListPushNotificationRequestQueryDto): Promise<GetPushNotificationListResponse> => {
    try {
      const result: GetPushNotificationListResponse = await this.pushNotificationDao.getPushNotificationList(query);
      return PushNotificationResponseAdminDto.toResponsePushNotificationList(result);
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * update Notification Message
   * @param notificationId notificationMessage _id
   * @param payload data to be updated
   * @returns updated data
   */
  updateNotificationMessage = async (notificationId: ObjectId, payload: UpdatePushNotificationMessageRequestDto): Promise<NotificationMessagesModelOutput> => {
    try {
      const data: NotificationMessagesModelOutput = await this.notificationMessagesDao.updateNotificationMessageById(notificationId, payload);
      return data;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get Notification Message List
   * @returns notification list
   */
  getListNotificationMessage = async (): Promise<NotificationMessagesModelOutput[]> => {
    try {
      const data: NotificationMessagesModelOutput[] = await this.notificationMessagesDao.getListNotificationMessage();
      return data;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * get Notification Message by Id
   * @param notificationId notificationMessage _id
   * @returns notification object
   */
  getListNotificationMessageById = async (notificationId: ObjectId): Promise<NotificationMessagesModelOutput> => {
    try {
      const data: NotificationMessagesModelOutput = await this.notificationMessagesDao.getListNotificationMessageById(notificationId);
      return data;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * send Timed Topic Push notification
   * @returns 
   */
  sendPushNotification = async (): Promise<void> => {
    try {
      const currentStartTime = dayjs().startOf('minute').toDate(), currentEndTime = dayjs().endOf('minute').toDate();
      const notificationList = await this.pushNotificationDao.getCurrentPushNotifications(currentStartTime, currentEndTime);
      if(!notificationList.length) {
        console.log("NOTIFICATION DOES NOT EXIST", currentStartTime);
        return;
      }

      // send users Topic notifications
      for(const notification of notificationList) {
        const publishData: PushTopicNotificationQueueInterface = {
          topic: notification.ePlatform,
          title: notification.sTitle,
          body: notification.sDescription
        }
        pushTopicNotificationQueuePublish(publishData);
      }
    }
    catch(error) {
      throw error;
    }
  }
}
