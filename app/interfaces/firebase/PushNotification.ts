export default interface PushNotificationInterface {
  token: string;

  title: string;
  body: string;
  imageUrl?: string;

  data?: {
    [key: string]: string;
  };
}
