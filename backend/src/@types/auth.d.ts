declare namespace Auth {
  interface Login {
    email: string;
    password: string;
    role: "customer" | "chef" | "admin";
  }
  interface Register extends Login {
    avatar: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
  interface ChangePassword {
    newPassword: string;
    oldPassword: string;
    uid: string;
    role: "customer" | "chef" | "admin";
  }
}
