declare namespace User {
  interface UserData {
    uid: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    avatar: string;
    refreshToken: string;
    role: RoleType;
    totalOrder: number;
    totalSpent: number;
    isVerified: boolean;
  }

  interface UserInfo extends UserData {
    createdAt: any;
    updatedAt: any;
  }
  interface AccessType {
    privilage: RoleType;
  }

  interface DecodeToken {
    uid: string;
    email: string;
    role: RoleType;
    iat: number;
    exp: number;
  }

  type RoleType = "customer" | "chef" | "admin";

  interface UserInfoWithOutPassword extends Omit<UserData, "password"> {}
}
