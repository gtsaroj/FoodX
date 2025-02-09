declare namespace Actions {
  interface addRevenue
    extends Omit<Models.Revenue, "createdAt" | "updatedAt"> {}

  interface AddNotification {
    userId: string;
    title: string;
    message: string;
  }

  interface DeleteNotification extends Pick<Model.Notification, "id"> {}

  interface UpdateProfile {
    avatar?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: number;
  }

  interface Login {
    email: string;
    password: string;
  }
 
  interface Register<T> {
   avatar: T;
   firstName: string;
   lastName: string;
   email: string;
   phoneNumber: string;
   password: string;
   confirmpassword?: string;
   role: Auth.role;
  }
 
 interface GetOrderModal<T> extends Common.FetchPaginate<T> {
  
   status?: Models.OrderStatus
   userId?: string;
 }
}
