declare namespace Api {
  interface Response<T> {
    success: boolean;
    data: T;
    message: string;
    statusCode: number;
  }

  // Notication actions

  interface FetchNotification extends Pick<Model.Notification, "uid"> {
    pageSize: number;
    sort: "asc" | "desc";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    direction?: "prev" | "next";
  }
  interface FetchOrder {
    currentFirstDoc: string;
    currentLastDoc: string;
    length: number;
    orders: Model.Order[];
  }

  interface ResponseNotification
    extends Pick<FetchNotification, "currentFirstDoc" | "currentLastDoc"> {
    notifications: Models.Notification[];
    length: number;
  }

  // Logs actions

  export interface Logs {
    id?: string;
    uid?: string;
    name?: string;
    profile?: string;
    action?:
      | "login"
      | "register"
      | "logout"
      | "create"
      | "update"
      | "delete"
      | "checkout"
      | undefined;

    detail?: string;
    date: string;
    open?: boolean;
    userId?: string;
    userRole?: string | UserRole["role"];
    handleClick?: (id: string) => void;
  }
}
