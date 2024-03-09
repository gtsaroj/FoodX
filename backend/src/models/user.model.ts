export interface Login {
  email: string;
  password: string;
}
export interface Register extends Login {
  avatar: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface User extends Register {
  token?: string;
}
