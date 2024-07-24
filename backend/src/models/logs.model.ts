export interface logProps {
  id: string;
  uid: string;
  name: string;
  profile: string;
  action:
    | "login"
    | "register"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "checkout";

  detail?: string;
  date: Date;
}
