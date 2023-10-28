export default interface MulticastNotificationInterface {
  tokens: string[];

  title: string;
  body: string;

  data?: {
    [key: string]: string;
  };
}
