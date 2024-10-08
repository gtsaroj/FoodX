export interface Notification {
  uid: string;
  title: string;
  message: string;
  createdAt: string;
}

export interface NotificationDetail extends Notification {
  id: string;
}
