import firebaseAdmin, { ServiceAccount, app, messaging } from 'firebase-admin';
import axios from 'axios';

import ConfigInterface from '@interfaces/firebase/Config';
import { Platform } from '@enums/firebase/platform';
import PushTopicNotificationInterface from '@interfaces/firebase/PushTopicNotification';
import PushNotificationInterface from '@interfaces/firebase/PushNotification';
import GenerateDynamicLinkInterface from '@interfaces/firebase/generateDynamicLink';
import MulticastNotificationInterface from '@interfaces/firebase/MulticastNotification';

const IS_DRY_RUN = false;
export default class FirebaseProvider {
  credentials: ServiceAccount;
  config: ConfigInterface;
  app: app.App;
  adminMessage: messaging.Messaging;

  constructor(credentials: ServiceAccount, config: ConfigInterface) {
    if(process.env.NODE_ENV === "development") {
      // return;
    }
    this.credentials = credentials;
    this.config = config;

    this.app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(this.credentials),
    });

    this.adminMessage = firebaseAdmin.messaging(this.app);
  }

  /**
   * subscribing to a topic
   * @param sPushToken token
   * @param ePlatform platform
   * @returns
   */
  subscribeUser = async (
    sPushToken: string,
    ePlatform: Platform,
  ): Promise<messaging.MessagingTopicManagementResponse> => {
    // default subscribing to topic
    await this.adminMessage.subscribeToTopic(sPushToken, 'All');

    let platform: string;
    if (ePlatform === 'A') {
      platform = 'Android';
    } else if (ePlatform === 'I') {
      platform = 'IOS';
    } else if (ePlatform === 'W') {
      platform = 'Web';
    } else {
      throw new Error('Invalid Platform');
    }
    return this.adminMessage.subscribeToTopic(sPushToken, platform);
  };

  private sendNotification = (message) => {
    return this.adminMessage.send(message, IS_DRY_RUN);
  }

  private createChunks = (array: string[], size: number = 500): string[][] => {
    const result = []
    for (let i = 0; i < array.length; i += size) {
      const chunks = array.slice(i, i + size)
      result.push(chunks)
    }
    return result;
  }
  // data: {
  //   title,
  //   message: body,
  //   sPushType: 'Home', // default
  //   isScheduled: 'true', //fixed
  //   id // optional
  //   matchCategory // optional
  // }
  /**
   * sending push topic notification
   * @param param0 object with topic, title, body, data
   * @param param0.topic topic
   * @param param0.title title of the notfication
   * @param param0.body body of the notification
   * @param param0.data data to be sent
   * @returns unique id
   */
  pushTopicNotification = async ({ topic, title, body, data }: PushTopicNotificationInterface): Promise<string> => {
    try {
      const message: messaging.Message = {
        topic,
        notification: {
          title,
          body,
        },
        data,
      };
      const result = await this.sendNotification(message);
      return result;
    }
    catch(error) {
      throw error;
    }
  };

  // data: {
  //   title,
  //   body,
  //   sPushType: 'Home', // default
  //   id // optional
  //   matchCategory // optional
  // }
  /**
   * sending push notification to a token
   * @param param0 object with token, title, body, data
   * @param param0.token token
   * @param param0.title title of the notfication
   * @param param0.body body of the notification
   * @param param0.data data to be sent
   * @returns unique id
   */
  pushNotification = async ({ token, title, body, data }: PushNotificationInterface): Promise<string> => {
    try {
      const message = {
        token,
        notification: {
          title,
          body,
        },
        data,
        // TODO why are we doing this?
        // webpush: {
        //   headers: {
        //     Urgency: 'high',
        //   },
        //   notification: {
        //     title,
        //     body,
        //     requireInteraction: true,
        //   },
        // },
      };
  
      const result = await this.sendNotification(message);
      return result;
    }
    catch(error) {
      throw error;
    }
  };

  /**
   * for generating dynamic link for referral
   * @param param0 type[share, join], code(referrral code), sportsType(type of sport), id(match id)
   * @param param0.type type of link
   * @param param0.code unique code
   * @param param0.sportsType type of sport
   * @param param0.id match id
   * @returns short link
   */
  generateDynamicLink = async ({ type, code, sportsType, id }: GenerateDynamicLinkInterface): Promise<string> => {
    try {
      let socialMetaTagInfo;
      let link: string;
      if (type === 'share') {
        socialMetaTagInfo = {
          socialTitle: this.config.SHARE_SOCIAL_TITLE,
          socialDescription: this.config.SHARE_SOCIAL_DESCRIPTION,
          // socialImageLink: 'https://housieskill-media.s3.ap-south-1.amazonaws.com/housie_ball.png',
        };
        link = `${this.config.FRONTEND_HOST_URL}/login?shareCode=${code}`;
      } else if (type === 'join') {
        socialMetaTagInfo = {
          socialTitle: this.config.PRIVATE_CONTEST_SOCIAL_TITLE,
          socialDescription: this.config.PRIVATE_CONTEST_SOCIAL_DESCRIPTION,
          // socialImageLink: 'https://housieskill-media.s3.ap-south-1.amazonaws.com/housie_ball.png',
        };
        link = `${this.config.FRONTEND_HOST_URL}/join-contest?sportsType=${sportsType}&matchId=${id}&code=${code}`;
      } else {
        throw new Error('Invalid Type');
      }

      const axiosData = {
        dynamicLinkInfo: {
          domainUriPrefix: this.config.DYNAMIC_LINK_DOMAIN_URI_PREFIX,
          link,
          androidInfo: {
            androidPackageName: this.config.DYNAMIC_LINK_ANDROID_PACKAGE_NAME,
            androidFallbackLink: this.config.FRONTEND_HOST_URL,
          },
          iosInfo: {
            iosBundleId: this.config.IOS_BUNDLE_ID,
            iosCustomScheme: this.config.IOS_CUSTOM_SCHEME,
            iosAppStoreId: this.config.IOS_APP_STORE_ID,
          },
          navigationInfo: {
            enableForcedRedirect: true,
          },
          socialMetaTagInfo,
        },
        suffix: {
          option: 'SHORT',
        },
      };

      const response = await axios({
        method: 'post',
        url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks`,
        params: {
          key: this.config.FIREBASE_WEB_API_KEY,
        },
        data: axiosData,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let shortLink: string;
      if (!response.data || !response.data.shortLink) {
        throw new Error('Error while generating link');
      }
      shortLink = response.data.shortLink;
      return shortLink;
    } catch (error) {
      throw error;
    }
  };

  // data: {
  //   title,
  //   body,
  //   sPushType: 'Home', // default
  //   id // optional
  //   matchCategory // optional
  // }
  /**
   * sending multi cast notification to tokens
   * @param param0 object with token, title, body, data
   * @param param0.tokens list of token
   * @param param0.title title of the notfication
   * @param param0.body body of the notification
   * @param param0.data data to be sent
   * @returns BatchResponse
   */
  sendEachForMulticastNotification = async ({
    tokens,
    title,
    body,
    data,
  }: MulticastNotificationInterface): Promise<messaging.BatchResponse> => {
    // tokens, title, body, sPushType = 'Home', id, matchCategory = ''
    try {
      // sending tokens in chunks, max limit 500
      let promiseArr = [];
      const tokenChunks: string[][] = this.createChunks(tokens);
      for(let i = 0; i < tokenChunks.length; i++) {
        const message = {
          notification: {
            title,
            body,
          },
          data,
          tokens: tokenChunks[i],
        };
        promiseArr.push(this.adminMessage.sendEachForMulticast(message, IS_DRY_RUN));
      }
      const responses: messaging.BatchResponse[] = await Promise.all(promiseArr);

      let result: messaging.BatchResponse = {
        responses: [],
        successCount: 0,
        failureCount: 0
      }
      for(let i = 0; i < responses.length; i++) {
        result.responses.push(...responses[i].responses);
        result.successCount += responses[i].successCount;
        result.failureCount += responses[i].failureCount;
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
}

export type Credential = ServiceAccount;
export type Config = ConfigInterface;
export type PushTopicNotification = PushTopicNotificationInterface;
export type PushNotification = PushNotificationInterface;
export type GenerateDynamicLink = GenerateDynamicLinkInterface;
export type MulticastNotification = MulticastNotificationInterface;
export type Message = messaging.Message;
export type BatchResponse = messaging.BatchResponse;
export type MessagingTopicManagementResponse = messaging.MessagingTopicManagementResponse;
