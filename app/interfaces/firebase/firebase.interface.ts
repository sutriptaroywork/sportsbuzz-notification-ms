import { Platform } from "@/enums/firebase/platform";

export interface PushTopicNotificationQueueInterface {
  topic: string;
  title: string;
  body: string;
  sPushType?: string;
  id?: string;
  matchCategory?: string;
}

export interface PushTokenNotificationQueueInterface {
  token: string;
  title: string;
  body: string;
  sPushType: string;
  id?: string;
  matchCategory?: string;
}

export interface SubscribeUserQueueInterface {
  sPushToken: string;
  ePlatform: Platform;
}

export interface SendMulticastNotificationQueueInterface {
  tokens: string[];
  title: string;
  body: string;
  sPushType: string;
  id?: string;
  matchCategory?: string;
}