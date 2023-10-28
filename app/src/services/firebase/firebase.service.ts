
import firebaseInstance from '@/library/Firebase';
import { BatchResponse, MessagingTopicManagementResponse } from '@/library/Firebase/Firebase';
import { FirebaseShortUrlRequestDto } from '@dtos/firebaseRequestDto/firebaseRequest.dto';
import GenerateDynamicLinkV2Interface from '@/interfaces/firebase/generateDynamicLink';
import PushTopicNotificationInterface from '@/interfaces/firebase/PushTopicNotification';
import PushNotificationInterface from '@/interfaces/firebase/PushNotification';
import { PushTokenNotificationQueueInterface, PushTopicNotificationQueueInterface, SendMulticastNotificationQueueInterface, SubscribeUserQueueInterface } from '@/interfaces/firebase/firebase.interface';
import MulticastNotificationInterface from '@/interfaces/firebase/MulticastNotification';
import rabbitmqConnection from '@connections/rabbitmq/rabbitmq';

const DEFAULT_PUSHTYPE = 'Home';
export default class FirebaseService {

  /**
   * generating short link
   * @param payload 
   * @returns Short link
   */
  createFirebaseShortUrl = async (payload: FirebaseShortUrlRequestDto): Promise<string> => {
    try {
      const data: GenerateDynamicLinkV2Interface = {
        type: payload.type,
        code: payload.code,
      }
      if(payload.sportsType) {
        data.sportsType = payload.sportsType;
      }
      if(payload.id) {
        data.id = String(payload.id);
      }
      let result: string = await firebaseInstance.generateDynamicLink(data);
      return result;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * subscribe tokens
   * @param data tokens and platform
   * @returns 
   */
  subscribeUser = async (data): Promise<MessagingTopicManagementResponse> => {
    try {
      const content: SubscribeUserQueueInterface = JSON.parse(data.content);
      console.log("Subscribe User via rabbitmq", content);
      const result: MessagingTopicManagementResponse = await firebaseInstance.subscribeUser(content.sPushToken, content.ePlatform);
      rabbitmqConnection.acknowledge(data);
      return result;
    }
    catch(error) {
      throw error;
    }
  }

  /**
  * push topic notification
  * @param data buffer data from the rabbitmq
  * @returns unique id returned from firebase
   */
  pushTopicNotification = async (data): Promise<string> => {
    try {
      const content: PushTopicNotificationQueueInterface = JSON.parse(data.content);
      console.log("Push topic notfication via rabbitmq", content);
      const payload: PushTopicNotificationInterface = {
        topic: content.topic,
        title: content.title,
        body: content.body,
        data: {
          title: content.title,
          message: content.body,
          sPushType: content.sPushType || DEFAULT_PUSHTYPE,
          isScheduled: 'true',
        }
      }
      if(content.id) {
        payload.data.id = content.id;
      }
      if(content.matchCategory) {
        payload.data.matchCategory = content.matchCategory;
      }
      const result: string = await firebaseInstance.pushTopicNotification(payload);
      rabbitmqConnection.acknowledge(data);
      return result;
    }
    catch(error) {
      throw error;
    }
  }

  /**
   * push notification to tokens
   * tokens must be in chunks
   * @param data buffer data from the rabbitmq
   * @returns unique id returned from firebase
   */
  pushTokenNotification = async (data): Promise<string> => {
    try {
      const content: PushTokenNotificationQueueInterface = JSON.parse(data.content);
      console.log("Push token notfication via rabbitmq", content);
      const payload: PushNotificationInterface = {
        token: content.token,
        title: content.title,
        body: content.body,
        data: {
          title: content.title,
          message: content.body,
          sPushType: content.sPushType || DEFAULT_PUSHTYPE,
          isScheduled: 'true',
        }
      }
      if(content.id) {
        payload.data.id = content.id;
      }
      if(content.matchCategory) {
        payload.data.matchCategory = content.matchCategory;
      }
      const result: string = await firebaseInstance.pushNotification(payload);
      rabbitmqConnection.acknowledge(data);
      return result;
    }
    catch(error) {
      throw error;
    }
  }

  sendEachForMulticastNotification = async (data): Promise<BatchResponse> => {
    try {
      const content: SendMulticastNotificationQueueInterface = JSON.parse(data.content);
      console.log("Multicast notfication via rabbitmq", content);

      const payload: MulticastNotificationInterface = {
        tokens: content.tokens,
        title: content.title,
        body: content.body,
        data: {
          title: content.title,
          message: content.body,
          sPushType: content.sPushType || DEFAULT_PUSHTYPE,
        }
      }
      if(content.id) {
        payload.data.id = content.id;
      }
      if(content.matchCategory) {
        payload.data.matchCategory = content.matchCategory;
      }

      const result = await firebaseInstance.sendEachForMulticastNotification(payload);
      rabbitmqConnection.acknowledge(data);
      return result;
    }
    catch(error) {
      throw error;
    }
  }
}
