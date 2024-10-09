export interface AddNotification {
  userId: string;
  title: string;
  message: string;
}

export interface Notification extends Omit<AddNotification, "userId"> {
  id: string;
  uid: string;
  createdAt : {_seconds:number}
}

export interface FetchNotification extends Pick<Notification, "uid"> {
  pageSize: number;
  sort: "asc" | "desc";
  currentFirstDoc: any | null;
  currentLastDoc: any | null;
  direction?: "prev" | "next";
}

export interface DeleteNotification extends Pick<Notification, "id"> {}

export interface ResponseNotification
  extends Pick<FetchNotification, "currentFirstDoc" | "currentLastDoc"> {
  notifications: Notification[];
  length: number;
}
