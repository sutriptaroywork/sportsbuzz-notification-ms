export default interface PushTopicNotification {
  topic: string;

  title: string;
  body: string;
  imageUrl?: string;

  data?: {
    [key: string]: string;
  };
}
