import { UserRole } from "./user.model";

export interface LogCardProps {
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
      | "checkout" |undefined
  
    detail?: string;
    date: string;
    open?: boolean;
    userId?: string;
    userRole?: string | UserRole["role"];
    handleClick?: (id: string) => void;
  }