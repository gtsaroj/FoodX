import { UserRole } from "./user.model";

export interface LogCardProps {
  id?: string;
  uid?: string;
  name?: string;
  profile?: string;
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
  open?: boolean;
  userId?: string,
  userRole?: string | UserRole
  handleClick?: (id: string) => void;
}

export interface GetLogProp {
  path: "adminLogs" | "chefLogs" | "customerLogs";
  pageSize: number;
  filter: keyof LogCardProps;
  sort: "asc" | "desc";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
  direction?: "prev" | "next";
  action?:
    | "login"
    | "register"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "checkout";
}
